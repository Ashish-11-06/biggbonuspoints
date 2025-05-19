// src/api/websocket.js

let socket = null;

export const connectWebSocket = (userId, userType, onMessageCallback, onOpen, onClose) => {
  if (!userId || !userType) {
    console.error('User ID and type required to connect WebSocket');
    return;
  }
  const SOCKET_URL = `ws://192.168.1.62:8000/ws/notifications/${userType}_${userId}`;


  socket = new WebSocket(SOCKET_URL);

  socket.onopen = () => {
    console.log(`✅ WebSocket connected to ${SOCKET_URL}`);
    if (onOpen) onOpen();
  };

  socket.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      console.log('📩 Message received:', data);
      onMessageCallback(data);
    } catch (err) {
      console.error('❌ Error parsing message:', err);
    }
  };

  socket.onerror = (e) => {
    console.log('❌ WebSocket error:', e.message);
  };

  socket.onclose = (e) => {
    console.log('🔌 WebSocket closed:', e.reason);
    if (onClose) onClose();
  };
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
