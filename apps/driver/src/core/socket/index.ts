import Config from 'react-native-config';
import { Platform } from 'react-native';
import { SocketManager } from '@dawwar/api-client';

const getSocketUrl = () => {
  const envUrl = Config.SOCKET_URL;
  if (__DEV__) {
    const host = Config.LOCAL_IP || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');
    if (!envUrl || envUrl.includes('10.0.2.2') || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
      return `http://${host}:3000`;
    }
    return envUrl;
  }
  return envUrl ?? 'https://api.dawwar.com';
};

const SOCKET_URL = getSocketUrl();

export const socketManager = new SocketManager(SOCKET_URL);
