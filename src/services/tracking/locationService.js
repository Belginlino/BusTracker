import { getDistanceMeters } from '../../utils/geoUtils';
import { GPS_CONFIG } from '../../utils/constants';

class LocationService {
  constructor() {
    this.watchId = null;
    this.lastPosition = null;
    this.lastSentTime = 0;
  }

  /**
   * Starts watching device GPS position with throttling rules
   */
  startTracking(busId, routeId, tripId, nextStopId, onLocationUpdate, onError) {
    if (!navigator.geolocation) {
      if (onError) onError('Geolocation API is not supported by this device.');
      return;
    }

    this.stopTracking();

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 3000,
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed, heading } = position.coords;
        const now = Date.now();

        let shouldUpdate = false;

        if (!this.lastPosition) {
          shouldUpdate = true;
        } else {
          const distanceMoved = getDistanceMeters(
            this.lastPosition.latitude,
            this.lastPosition.longitude,
            latitude,
            longitude
          );

          const timeElapsed = now - this.lastSentTime;

          // Check configurable movement & time thresholds (Low bandwidth optimization)
          if (
            distanceMoved >= GPS_CONFIG.MIN_DISTANCE_THRESHOLD_M ||
            timeElapsed >= GPS_CONFIG.MIN_TIME_INTERVAL_MS
          ) {
            shouldUpdate = true;
          }
        }

        if (shouldUpdate) {
          const locationData = {
            latitude,
            longitude,
            speed: speed ? Math.round(speed * 3.6) : 25, // Convert m/s to km/h or fallback
            heading: heading || 0,
            timestamp: new Date().toISOString(),
            routeId,
            tripId,
            nextStopId,
            isDemo: false,
          };

          this.lastPosition = { latitude, longitude };
          this.lastSentTime = now;

          onLocationUpdate(locationData);
        }
      },
      (error) => {
        let msg = 'Unknown GPS error';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'GPS permission denied. Please allow location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Device location unavailable.';
            break;
          case error.TIMEOUT:
            msg = 'GPS location request timed out.';
            break;
        }
        if (onError) onError(msg);
      },
      options
    );
  }

  stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.lastPosition = null;
      this.lastSentTime = 0;
    }
  }
}

export const locationService = new LocationService();
