import Config from 'react-native-config';
import { USE_MOCK_API } from '../api/config';

const SOCKET_URL = Config.SOCKET_URL ?? 'http://10.0.2.2:3000';

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
