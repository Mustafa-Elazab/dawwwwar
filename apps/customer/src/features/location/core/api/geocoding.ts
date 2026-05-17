import axios from 'axios';

export type GeocodingLocale = 'ar' | 'en';

export interface GeocodingResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

const nominatimLang = (locale?: string): GeocodingLocale =>
  locale?.toLowerCase().startsWith('ar') ? 'ar' : 'en';

/** In-memory throttle: avoid hammering Nominatim (usage policy). */
const reverseCache = new Map<string, string>();
const lastReverseAt = new Map<string, number>();
const REVERSE_MIN_INTERVAL_MS = 1100;

function reverseCacheKey(lat: number, lon: number, lang: GeocodingLocale) {
  return `${lat.toFixed(5)},${lon.toFixed(5)},${lang}`;
}

export const geocodingApi = {
  /**
   * Reverse geocoding: Lat/Lng -> Readable short label
   */
  reverse: async (lat: number, lon: number, locale?: string): Promise<string> => {
    const lang = nominatimLang(locale);
    const ck = reverseCacheKey(lat, lon, lang);
    const cached = reverseCache.get(ck);
    if (cached) return cached;

    const now = Date.now();
    const last = lastReverseAt.get(ck) ?? 0;
    if (now - last < REVERSE_MIN_INTERVAL_MS) {
      await new Promise((r) => setTimeout(r, REVERSE_MIN_INTERVAL_MS - (now - last)));
    }
    lastReverseAt.set(ck, Date.now());

    try {
      const { data } = await axios.get(`${NOMINATIM_BASE_URL}/reverse`, {
        params: {
          format: 'jsonv2',
          lat,
          lon,
          'accept-language': lang,
        },
        headers: {
          'User-Agent': 'DawwarApp/1.0 (Dawwar Customer; contact@dawwar.app)',
        },
      });

      const addr = data.address ?? {};
      const city = addr.city || addr.town || addr.village;
      const district = addr.suburb || addr.neighbourhood || addr.city_district;

      let label: string;
      if (city && district) {
        label = `${district}, ${city}`;
      } else if (city) {
        label = String(city);
      } else {
        label = String(data.display_name ?? '').split(',').slice(0, 2).join(',').trim();
      }

      if (label) reverseCache.set(ck, label);
      return label || '';
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return '';
    }
  },

  /**
   * Search geocoding: Query -> Suggestions
   */
  search: async (query: string, locale?: string): Promise<GeocodingResult[]> => {
    if (!query || query.length < 3) return [];
    const lang = nominatimLang(locale);

    try {
      const { data } = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
        params: {
          q: query,
          format: 'jsonv2',
          addressdetails: 1,
          limit: 10,
          'accept-language': lang,
          countrycodes: 'eg', // Restrict to Egypt
        },
        headers: {
          'User-Agent': 'DawwarApp/1.0',
        },
      });
      return data;
    } catch (error) {
      console.error('Search geocoding failed:', error);
      return [];
    }
  },
};
