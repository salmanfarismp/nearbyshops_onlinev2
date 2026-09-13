/**
 * Parses a PostGIS EWKB hex string or GeoJSON object to { lat, lon }.
 * Ported from the native app's src/utils/distance.ts.
 */
export function parsePostGisPoint(
  hexStr: string | object | null | undefined,
): { lat: number; lon: number } | null {
  try {
    if (!hexStr) return null;

    // GeoJSON object (e.g. { type: 'Point', coordinates: [lon, lat] })
    if (typeof hexStr === "object") {
      const geo = hexStr as any;
      if (geo.type === "Point" && Array.isArray(geo.coordinates)) {
        return { lon: geo.coordinates[0], lat: geo.coordinates[1] };
      }
      return null;
    }

    if (typeof hexStr !== "string") return null;

    // PostGIS EWKB hex format
    if (
      hexStr.length >= 50 &&
      (hexStr.startsWith("0101000020E6100000") ||
        hexStr.startsWith("0101000000"))
    ) {
      const hexBytes = hexStr.match(/.{1,2}/g);
      if (!hexBytes) return null;

      const uintArray = new Uint8Array(
        hexBytes.map((byte) => parseInt(byte, 16)),
      );
      const dataView = new DataView(uintArray.buffer);

      // Last 16 bytes = 2 doubles (lon, lat) in little-endian
      const lon = dataView.getFloat64(uintArray.length - 16, true);
      const lat = dataView.getFloat64(uintArray.length - 8, true);

      return { lat, lon };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Calculates the great-circle distance between two points in kilometers using the Haversine formula.
 * Ported from nearbyshops-app/src/utils/distance.ts.
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Radius of the earth in km
  const deg2rad = (deg: number) => deg * (Math.PI / 180);
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

/** Map day index (0=Sun) to schema.org DayOfWeek */
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/**
 * Builds an openingHoursSpecification array for JSON-LD LocalBusiness.
 * @param openDays   Array of day indices (0–6) or their string equivalents
 * @param openTime   "HH:MM:SS" or "HH:MM"
 * @param closeTime  "HH:MM:SS" or "HH:MM"
 */
export function buildOpeningHours(
  openDays: (string | number)[] | null | undefined,
  openTime: string | null | undefined,
  closeTime: string | null | undefined,
): object[] {
  if (!openDays?.length || !openTime || !closeTime) return [];

  const opens = openTime.slice(0, 5); // "HH:MM"
  const closes = closeTime.slice(0, 5);

  return openDays.map((d) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: `https://schema.org/${DAY_NAMES[Number(d)]}`,
    opens,
    closes,
  }));
}
