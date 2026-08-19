import { getDistanceMeters } from '../../utils/geoUtils';

/**
 * Calculates ETA from bus position to the target stop.
 * Uses current speed if reliable (> 5 km/h), otherwise defaults to route average speed.
 */
export function calculateETA({ busLocation, targetStop, routeAverageSpeedKmH = 28, delayMinutes = 0 }) {
  if (!busLocation || !targetStop || !targetStop.latitude || !targetStop.longitude) {
    return { status: 'unavailable', text: 'ETA unavailable', minutes: null };
  }

  const distanceMeters = getDistanceMeters(
    busLocation.latitude,
    busLocation.longitude,
    targetStop.latitude,
    targetStop.longitude
  );

  // Effective speed selection (current speed when reliable, otherwise route average)
  let speedKmH = busLocation.speed;
  if (speedKmH === null || speedKmH === undefined || speedKmH < 5) {
    speedKmH = routeAverageSpeedKmH;
  }

  // Safety cap on speed (city traffic max 60 km/h)
  speedKmH = Math.min(Math.max(speedKmH, 10), 60);

  // Speed in meters per minute
  const speedMetersPerMin = (speedKmH * 1000) / 60;

  let travelMinutes = distanceMeters / speedMetersPerMin;
  
  // Add delay penalty if reported
  if (delayMinutes > 0) {
    travelMinutes += delayMinutes;
  }

  const roundedMinutes = Math.max(1, Math.round(travelMinutes));

  if (distanceMeters < 50) {
    return {
      status: 'arriving',
      text: 'Arriving now at stop',
      minutes: 0,
      distanceMeters,
    };
  }

  if (roundedMinutes <= 1) {
    return {
      status: 'imminent',
      text: 'Arriving in ~1 min',
      minutes: 1,
      distanceMeters,
    };
  }

  return {
    status: 'estimated',
    text: `Arriving in ~${roundedMinutes} min`,
    minutes: roundedMinutes,
    distanceMeters,
  };
}
