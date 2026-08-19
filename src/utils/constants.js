export const ROLES = {
  PASSENGER: 'passenger',
  DRIVER: 'driver',
  ADMIN: 'admin',
};

export const BUS_STATUS = {
  ON_TIME: 'on_time',
  DELAYED: 'delayed',
  BREAKDOWN: 'breakdown',
  INACTIVE: 'inactive',
};

export const TRIP_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const DEFAULT_MAP_CENTER = {
  lat: 12.3118,
  lng: 76.6529,
  zoom: 13,
};

// GPS Tracking thresholds (Low-bandwidth optimized)
export const GPS_CONFIG = {
  MIN_TIME_INTERVAL_MS: 5000,    // Send update every 5 sec minimum
  MIN_DISTANCE_THRESHOLD_M: 10,  // Or if moved > 10 meters
  STALE_DATA_TIMEOUT_MS: 60000, // Consider stale after 60s
};

export const STORAGE_KEYS = {
  FAVORITES: 'transitpulse_favorites',
  USER_ROLE: 'transitpulse_role',
  SIMULATION_STATE: 'transitpulse_simulation',
};
