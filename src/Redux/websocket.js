// src/api/websocket.js
import Sound from 'react-native-sound';
import PushNotification from 'react-native-push-notification';

let socket = null;

// Enable playback in silent mode (especially for iOS)
Sound.setCategory('Playback');

export const connectWebSocket = (userId, userType, onMessageCallback, onOpen, onClose) => {
  if (!userId || !userType) {
    console.error('User ID and type required to connect WebSocket');
    return;
  }

  const SOCKET_URL = `ws://192.168.1.40:8000/ws/notifications/${userType}_${userId}`;

  socket = new WebSocket(SOCKET_URL);

  socket.onopen = () => {
    console.log(`✅ WebSocket connected to ${SOCKET_URL}`);
    if (onOpen) onOpen();
  };

  socket.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      console.log('📩 Message received:', data);

      // Check if unread notifications increased and new_notification is present
      if (data.unread_count > 0 && data.new_notification) {
        const { title, description } = data.new_notification;

        // 🔊 Play notification sound
        const notificationSound = new Sound('notification.wav', Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('❌ Error loading sound:', error);
            return;
          }
          notificationSound.play((success) => {
            if (!success) {
              console.log('❌ Sound playback failed');
            }
          });
        });

        // 🔔 Show local notification
        PushNotification.localNotification({
          channelId: "notification-channel",
          title: title || "New Notification",
          message: description || "You have a new message",
          playSound: false, // Already played custom sound
          vibrate: true,
        });
      }

      // Callback to update UI
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
