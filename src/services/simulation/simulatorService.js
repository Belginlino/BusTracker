import { store } from '../../data/store';
import { getBearing, getDistanceMeters } from '../../utils/geoUtils';

class SimulatorService {
  constructor() {
    this.intervalId = null;
    this.isRunning = false;
    this.isPaused = false;
    this.busProgress = {}; // Store current segment index and interpolation step per bus
  }

  start() {
    if (this.isRunning && !this.isPaused) return;

    this.isRunning = true;
    this.isPaused = false;
    store.simulationActive = true;
    store.simulationPaused = false;

    // Initialize progress per bus
    store.buses.forEach((bus) => {
      if (!this.busProgress[bus.id]) {
        this.busProgress[bus.id] = {
          segmentIndex: 0,
          progress: 0.1, // 0.0 to 1.0 along segment
        };
      }
    });

    // Run simulation tick every 2 seconds
    this.intervalId = setInterval(() => this.tick(), 2000);
    store.notify();
  }

  pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isPaused = true;
    store.simulationPaused = true;
    store.notify();
  }

  stop() {
    this.pause();
    this.isRunning = false;
    this.isPaused = false;
    store.simulationActive = false;
    store.notify();
  }

  reset() {
    this.stop();
    this.busProgress = {};
    store.notify();
  }

  tick() {
    if (!this.isRunning || this.isPaused) return;

    store.buses.forEach((bus) => {
      const route = store.routes.find((r) => r.id === bus.routeId);
      if (!route || !route.coordinates || route.coordinates.length < 2) return;

      const coords = route.coordinates;
      let state = this.busProgress[bus.id] || { segmentIndex: 0, progress: 0 };

      // Advance progress along current coordinate segment
      state.progress += 0.08; // Step forward

      if (state.progress >= 1.0) {
        state.progress = 0;
        state.segmentIndex = (state.segmentIndex + 1) % (coords.length - 1);
      }

      this.busProgress[bus.id] = state;

      const currentPoint = coords[state.segmentIndex];
      const nextPoint = coords[state.segmentIndex + 1] || coords[0];

      // Interpolate coordinate
      const lat = currentPoint.lat + (nextPoint.lat - currentPoint.lat) * state.progress;
      const lng = currentPoint.lng + (nextPoint.lng - currentPoint.lng) * state.progress;
      const bearing = getBearing(currentPoint.lat, currentPoint.lng, nextPoint.lat, nextPoint.lng);

      // Determine next stop
      const nextStopIndex = Math.min(state.segmentIndex + 1, route.stopIds.length - 1);
      const nextStopId = route.stopIds[nextStopIndex] || route.stopIds[0];

      const simSpeed = bus.status === 'delayed' ? 14 : Math.floor(25 + Math.random() * 15);

      const locationUpdate = {
        latitude: lat,
        longitude: lng,
        speed: simSpeed,
        heading: Math.round(bearing),
        timestamp: new Date().toISOString(),
        routeId: route.id,
        tripId: `demo_trip_${bus.id}`,
        nextStopId: nextStopId,
        isDemo: true,
      };

      store.updateLocation(bus.id, locationUpdate);
    });
  }
}

export const simulatorService = new SimulatorService();
