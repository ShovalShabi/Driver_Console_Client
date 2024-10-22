/**
 * Decodes a Google Maps encoded polyline string into an array of geographical coordinates.
 *
 * The polyline encoding is a lossy compression algorithm that allows latitude and longitude
 * values to be represented in a compressed format. This function decodes the polyline string
 * and returns an array of points with `latitude` and `longitude`.
 *
 * @param {string} encoded - The encoded polyline string.
 * @returns {Array<{latitude: number, longitude: number}>} An array of points with latitude and longitude.
 */
const decodePolyline = (
  encoded: string
): Array<{ latitude: number; longitude: number }> => {
  let points = [];
  let index = 0,
    lat = 0,
    lng = 0;

  while (index < encoded.length) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
};

export default decodePolyline;
