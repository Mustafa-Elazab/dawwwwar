import axios from 'axios';
import {
  __resetGeocodingApiForTests,
  geocodingApi,
  REVERSE_GEOCODE_MIN_INTERVAL_MS,
} from '../src/features/location/core/api/geocoding';

jest.mock('axios', () => ({
  get: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('customer geocoding API', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-11T13:11:34.000Z'));
    mockedAxios.get.mockReset();
    __resetGeocodingApiForTests();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('spaces reverse geocoding requests by the configured interval', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        display_name: 'Mansoura, Egypt',
        address: { city: 'Mansoura', suburb: 'Talkha' },
      },
    });

    await geocodingApi.reverse(30.870375, 31.474071, 'ar');
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    const secondRequest = geocodingApi.reverse(30.871375, 31.475071, 'ar');
    await Promise.resolve();

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(REVERSE_GEOCODE_MIN_INTERVAL_MS - 1);
    await Promise.resolve();
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1);
    await secondRequest;
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });

  it('reuses cached reverse geocoding results for nearby coordinates', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        display_name: 'Mansoura, Egypt',
        address: { city: 'Mansoura', suburb: 'Talkha' },
      },
    });

    await geocodingApi.reverse(30.870375, 31.474071, 'ar');
    await geocodingApi.reverse(30.870376, 31.474072, 'ar');

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });
});
