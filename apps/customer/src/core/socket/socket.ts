// Phase 1: Socket is a no-op stub.
// Phase 2: Replace with real socket.io-client connection.
// The interface is identical so no screen code changes when we switch.

import Config from 'react-native-config';

const SOCKET_URL = Config.SOCKET_URL ?? 'https://api.dawwar.com';

// Stub event emitter to prevent "socket is undefined" crashes in Phase 1
const noopSocket = {
  on: (_event: string, _handler: unknown) => noopSocket,
  off: (_event: string, _handler: unknown) => noopSocket,
  emit: (_event: string, ..._args: unknown[]) => noopSocket,
  connect: () => noopSocket,
  disconnect: () => noopSocket,
  connected: false,
};

// TODO: Phase 2 — replace with:
// import { io } from 'socket.io-client';
// export const socket = io(SOCKET_URL, {
//   auth: { token: storage.getString(StorageKeys.ACCESS_TOKEN) },
//   autoConnect: false,
// });

export const socket = noopSocket;
