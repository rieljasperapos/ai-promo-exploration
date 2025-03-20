import { getDistance } from "geolib";

export const isWithinRadius = (
  userLocation: { lat: number; lng: number },
  branchLocation: { lat: number; lng: number },
  radius: number
): boolean => {
  const distance = getDistance(
    { latitude: userLocation.lat, longitude: userLocation.lng },
    { latitude: branchLocation.lat, longitude: branchLocation.lng }
  );
  return distance <= radius;
};
