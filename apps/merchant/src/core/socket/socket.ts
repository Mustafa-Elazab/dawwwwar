// Socket.IO connection stub for driver app
// Real implementation in later tasks

export function createSocketConnection() {
  return {
    connect: () => {
      console.log('[Socket] Connection stub - not implemented yet');
    },
    disconnect: () => {
      console.log('[Socket] Disconnect stub - not implemented yet');
    },
    on: () => {
      // No-op
    },
    off: () => {
      // No-op
    },
    emit: () => {
      // No-op
    },
  };
}

export const socket = createSocketConnection();
