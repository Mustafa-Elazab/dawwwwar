export const SOCKET_EVENTS = {
  // Server → Client
  ORDER_NEW: 'order:new',
  ORDER_STATUS_CHANGED: 'order:status_changed',
  ORDER_DRIVER_ASSIGNED: 'order:driver_assigned',
  DRIVER_LOCATION: 'driver:location',
  MERCHANT_ORDER_ALERT: 'merchant:order_alert',
  CHAT_NEW_MESSAGE: 'CHAT_NEW_MESSAGE',
  CHAT_USER_TYPING: 'CHAT_USER_TYPING',
  WALLET_RECHARGED: 'wallet:recharged',
  ERROR: 'error',

  // Client → Server
  DRIVER_LOCATION_UPDATE: 'driver:location_update',
  JOIN_ORDER_ROOM: 'join:order_room',
  LEAVE_ORDER_ROOM: 'leave:order_room',
  JOIN_MERCHANT_ROOM: 'join:merchant_room',
  JOIN_DRIVER_ROOM: 'join:driver_room',
  CHAT_JOIN_CONVERSATION: 'CHAT_JOIN_CONVERSATION',
  CHAT_SEND_MESSAGE: 'CHAT_SEND_MESSAGE',
  CHAT_TYPING_START: 'CHAT_TYPING_START',
  CHAT_TYPING_STOP: 'CHAT_TYPING_STOP',
  CHAT_ACK_MESSAGE: 'CHAT_ACK_MESSAGE',
} as const;

// Room naming conventions
export const Rooms = {
  order: (orderId: string) => `order:${orderId}`,
  merchant: (merchantId: string) => `merchant:${merchantId}`,
  driver: (driverId: string) => `driver:${driverId}`,
  customer: (customerId: string) => `customer:${customerId}`,
  availableDrivers: () => 'drivers/available',
  adminLive: () => 'admin/live',
};
