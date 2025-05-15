// src/websocket/websocket.js

const SOCKET_URL = 'wss://your-backend-server.com/ws/notifications/'; // Replace with your backend URL

let socket = null;

export const connectWebSocket = (onMessageCallback) => {
  socket = new WebSocket(SOCKET_URL);

  socket.onopen = () => {
    console.log('✅ WebSocket connected');
  };

  socket.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      onMessageCallback(data);
    } catch (err) {
      console.error('❌ Error parsing message:', err);
    }
  };

  socket.onerror = (e) => {
    console.error('❌ WebSocket error:', e.message);
  };

  socket.onclose = (e) => {
    console.log('🔌 WebSocket closed:', e.reason);
  };
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
