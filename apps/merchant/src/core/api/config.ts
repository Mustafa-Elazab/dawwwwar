import Config from 'react-native-config';

/**
 * USE_MOCK_API=true  → Phase 1: calls @dawwar/mocks handlers
 * USE_MOCK_API=false → Phase 2: calls real Axios to backend
 *
 * To switch: change .env file and restart Metro with --reset-cache
 */
export const USE_MOCK_API = Config.USE_MOCK_API !== 'false';

export const API_BASE_URL =
  Config.API_BASE_URL ?? 'http://10.0.2.2:3000/api/v1';
