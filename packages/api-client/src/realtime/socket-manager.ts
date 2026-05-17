import { io, Socket } from 'socket.io-client';
import { tokenManager } from '../client/token-manager';

export class SocketManager {
  private socket: Socket | null = null;
  private persistentRooms: Set<{ event: string; data: any }> = new Set();

  constructor(private url: string) {}

  connect() {
    if (this.socket?.connected) return this.socket;

    const token = tokenManager.accessToken;

    this.socket = io(this.url, {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected to server');
      // Auto-rejoin persistent rooms on reconnection
      this.persistentRooms.forEach((room) => {
        console.log(`[Socket] Re-joining room: ${room.event}`, room.data);
        this.socket?.emit(room.event, room.data);
      });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.warn('[Socket] Connection Error:', error.message);
    });

    this.socket.on('reconnect_attempt', (attempt) => {
      console.log(`[Socket] Reconnection attempt #${attempt}...`);
    });

    this.socket.on('reconnect', (attempt) => {
      console.log(`[Socket] Reconnected after ${attempt} attempts`);
    });

    return this.socket;
  }

  /**
   * Joins a room and marks it as persistent so it auto-rejoins on reconnect.
   */
  joinRoom(event: string, data: any) {
    this.persistentRooms.add({ event, data });
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      this.connect();
    }
  }

  /**
   * Leaves a room and removes it from persistent list.
   */
  leaveRoom(event: string, data: any) {
    // Find and remove from persistent set
    this.persistentRooms.forEach((room) => {
      if (room.event === event && JSON.stringify(room.data) === JSON.stringify(data)) {
        this.persistentRooms.delete(room);
      }
    });
    this.socket?.emit(event, data);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.persistentRooms.clear();
  }

  get instance() {
    return this.socket;
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (data: any) => void) {
    this.socket?.off(event, callback);
  }
}

export const socketManager = new SocketManager('http://localhost:3000'); // Default URL, can be re-initialized by apps
