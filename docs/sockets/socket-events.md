# Socket Events - Dawwar

The `AppGateway` handles real-time communication using **Socket.IO**.

## Common Payload Fields
- `timestamp`: Epoch milliseconds.
- `orderId`: Associated order (if applicable).

## Events List

### Driver Location Updates
- **Event:** `DRIVER_LOCATION_UPDATE` (Client -> Server)
- **Payload:** `{ latitude: number, longitude: number, heading?: number, orderId?: string }`
- **Sender:** Driver App.
- **Receiver:** Server.
- **Throttling:** Max once per 2 seconds.

- **Event:** `DRIVER_LOCATION` (Server -> Client)
- **Payload:** `{ orderId: string, latitude: number, longitude: number, heading?: number }`
- **Receiver:** Customer App (when tracking is active).

### Order Status Changes
- **Event:** `ORDER_STATUS_CHANGED` (Server -> Client)
- **Payload:** `{ orderId: string, status: OrderStatus, message: string }`
- **Receiver:** Relevant Customer & Merchant.

### Room Management
- **`order:{id}`:** Joined by Customer and Driver for live tracking.
- **`merchant:{id}`:** Joined by Merchant for incoming orders.
- **`customer:{id}`:** Joined by Customer for personal alerts.

## Reliability Features
- **Reconnection:** App automatically reconnects and re-joins active rooms based on current screen context.
- **Cleanup:** Connections are automatically purged from memory maps on disconnect.
- **Security:** All connections require a valid `Bearer Token` in the handshake.
