import { INITIAL_BUSES, INITIAL_ROUTES, INITIAL_STOPS, INITIAL_DRIVERS, INITIAL_LOCATIONS, INITIAL_ALERTS } from './seedData';
import { db, isFirebaseConfigured } from '../services/firebase/config';
import { collection, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';

class TransitDataStore {
  constructor() {
    this.buses = [...INITIAL_BUSES];
    this.routes = [...INITIAL_ROUTES];
    this.stops = [...INITIAL_STOPS];
    this.drivers = [...INITIAL_DRIVERS];
    this.locations = { ...INITIAL_LOCATIONS };
    this.alerts = [...INITIAL_ALERTS];
    this.favorites = JSON.parse(localStorage.getItem('transitpulse_favorites') || '[]');
    
    this.listeners = new Set();
    this.simulationActive = false;
    this.simulationPaused = false;

    if (isFirebaseConfigured && db) {
      this.initFirestoreListeners();
    }
  }

  // Subscribe to real-time store changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    for (const callback of this.listeners) {
      callback({
        buses: this.buses,
        routes: this.routes,
        stops: this.stops,
        drivers: this.drivers,
        locations: this.locations,
        alerts: this.alerts,
        favorites: this.favorites,
        simulationActive: this.simulationActive,
        simulationPaused: this.simulationPaused,
      });
    }
  }

  // Firestore Real-Time Listeners
  initFirestoreListeners() {
    try {
      onSnapshot(collection(db, 'locations'), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added' || change.type === 'modified') {
            this.locations[change.doc.id] = { id: change.doc.id, ...change.doc.data() };
          }
        });
        this.notify();
      });

      onSnapshot(collection(db, 'alerts'), (snapshot) => {
        this.alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        this.notify();
      });

      onSnapshot(collection(db, 'buses'), (snapshot) => {
        this.buses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        this.notify();
      });
    } catch (err) {
      console.warn('Firestore subscription error, using local reactive store:', err.message);
    }
  }

  // Update Bus Location (Driver GPS or Simulator)
  async updateLocation(busId, locationData) {
    const updatedLocation = {
      ...locationData,
      timestamp: new Date().toISOString(),
    };

    this.locations[busId] = updatedLocation;

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'locations', busId), updatedLocation, { merge: true });
      } catch (err) {
        console.warn('Failed writing location to Firestore:', err.message);
      }
    }

    this.notify();
  }

  // Favorites Management
  toggleFavorite(type, targetId) {
    const index = this.favorites.findIndex(f => f.type === type && f.targetId === targetId);
    if (index >= 0) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push({ type, targetId, createdAt: new Date().toISOString() });
    }
    localStorage.setItem('transitpulse_favorites', JSON.stringify(this.favorites));
    this.notify();
  }

  isFavorite(type, targetId) {
    return this.favorites.some(f => f.type === type && f.targetId === targetId);
  }

  // Alerts Management
  addAlert(alertData) {
    const newAlert = {
      id: `alert_${Date.now()}`,
      active: true,
      createdAt: new Date().toISOString(),
      ...alertData
    };
    this.alerts.unshift(newAlert);
    
    if (isFirebaseConfigured && db) {
      try {
        setDoc(doc(db, 'alerts', newAlert.id), newAlert);
      } catch (err) {
        console.warn('Alert write error:', err);
      }
    }
    this.notify();
  }
}

export const store = new TransitDataStore();
