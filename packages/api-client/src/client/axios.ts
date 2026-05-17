import axios, { AxiosInstance } from 'axios';

export const createApiClient = (baseURL: string): AxiosInstance => {
  return axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
