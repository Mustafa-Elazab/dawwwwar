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

// Phase 2: uncomment this block and delete noopSocket above
/*
import { io } from 'socket.io-client';
import { storage, StorageKeys } from '../storage/mmkv';

const realSocket = io(SOCKET_URL, {
  auth: { token: storage.getString(StorageKeys.ACCESS_TOKEN) },
  autoConnect: false,
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});
*/

export const socket = USE_MOCK_API ? noopSocket : noopSocket; // ← Phase 2: replace second noopSocket with realSocket
