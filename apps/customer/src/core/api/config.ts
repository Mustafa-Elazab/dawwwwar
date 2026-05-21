import { appConfig } from '../config/app.config';

/**
 * USE_MOCK_API=true  → calls @dawwar/mocks handlers
 * USE_MOCK_API=false → calls real Axios to backend
 *
 * To switch: change .env file and restart Metro with --reset-cache
 */
export const USE_MOCK_API = appConfig.useMockApi;

export const API_BASE_URL = appConfig.api.baseUrl;
