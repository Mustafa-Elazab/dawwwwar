import axios from 'axios';
import { Platform } from 'react-native';
import Config from 'react-native-config';

const API_BASE_URL = Config.API_URL || 'http://10.0.2.2:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Platform': Platform.OS,
  },
  timeout: 30000,
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // Token will be added from Redux store in actual implementation
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (401, 403, 500, etc.)
    return Promise.reject(error);
  },
);

export type { AxiosError, AxiosResponse } from 'axios';
