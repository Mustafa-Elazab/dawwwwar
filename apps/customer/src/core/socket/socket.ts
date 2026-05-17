import Config from 'react-native-config';
import { Platform } from 'react-native';
import { USE_MOCK_API } from '../api/config';

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

// Phase 1: no-op stub
const noopSocket = {
  on: (_event: string, _handler: unknown) => noopSocket,
  off: (_event: string, _handler: unknown) => noopSocket,
  emit: (_event: string, ..._args: unknown[]) => noopSocket,
  connect: () => noopSocket,
  disconnect: () => noopSocket,
  connected: false,
};

function createRealSocket() {
  // Dynamic import so the mock build doesn't bundle socket.io-client
  const { io } = require('socket.io-client') as typeof import('socket.io-client');
  const { storage, StorageKeys } = require('../storage/mmkv');
  const token = storage.getString(StorageKeys.ACCESS_TOKEN);
  return io(SOCKET_URL, {
    auth: { token },
    autoConnect: false,
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    timeout: 10000,
  });
}

export const socket = USE_MOCK_API ? noopSocket : createRealSocket();
