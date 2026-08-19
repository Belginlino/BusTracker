/**
 * Formats a timestamp into human-readable relative time (e.g., "Just now", "2 minutes ago")
 */
export function formatTimeAgo(timestamp) {
  if (!timestamp) return 'No data';
  
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 10) return 'Just now';
  if (seconds < 60) return `${seconds} sec ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Checks if a location timestamp is considered stale (> 60 seconds old)
 */
export function isStaleTimestamp(timestamp, thresholdMs = 60000) {
  if (!timestamp) return true;
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Date() - date > thresholdMs;
}

/**
 * Formats speed in km/h
 */
export function formatSpeed(speedKmH) {
  if (speedKmH === null || speedKmH === undefined || isNaN(speedKmH)) return '0 km/h';
  return `${Math.round(speedKmH)} km/h`;
}
