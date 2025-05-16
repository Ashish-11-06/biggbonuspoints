
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      title: 'Welcome!',
      message: 'Thanks for joining our platform.',
      timestamp: new Date().toISOString(),
    },
    {
      title: 'Payment Successful',
      message: 'Your payment of ₹500 has been processed.',
      timestamp: new Date().toISOString(),
    },

    
    {
      title: 'New Offer',
      message: 'Get 20% off on your next transaction.',
      timestamp: new Date().toISOString(),
    },
    {
      title: 'Account Verified',
      message: 'Your KYC has been successfully verified.',
      timestamp: new Date().toISOString(),
    },
    {
      title: 'Support Message',
      message: 'Our team will get back to you shortly.',
      timestamp: new Date().toISOString(),
    },
  ]);

  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fc',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#F14242',
  },
  notificationCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004BFF',
    marginBottom: 6,
  },
  notificationMessage: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
});









// // src/screens/Notifications.js
// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSelector, useDispatch } from 'react-redux';
// import { clearUnreadCount } from '../Redux/slices/notificationSlice';
// import { connectWebSocket, closeWebSocket } from '../Redux/websocket';

// const Notifications = () => {
//   const dispatch = useDispatch();
//   const [userId, setUserId] = useState(null);
//   const [userType, setUserType] = useState(null); // Track user type
//   const [wsConnected, setWsConnected] = useState(false); // Track WebSocket status

//   const unreadCount = useSelector((state) =>
//     userId ? state.notification.unreadCount[userId] || 0 : 0
//   );

//   const [notifications, setNotifications] = useState([
//     {
//       title: 'Welcome!',
//       message: 'Thanks for joining our platform.',
//       timestamp: new Date().toISOString(),
//     },
//     {
//       title: 'Payment Successful',
//       message: 'Your payment of ₹500 has been processed.',
//       timestamp: new Date().toISOString(),
//     },
//     {
//       title: 'New Offer',
//       message: 'Get 20% off on your next transaction.',
//       timestamp: new Date().toISOString(),
//     },
//     {
//       title: 'Account Verified',
//       message: 'Your KYC has been successfully verified.',
//       timestamp: new Date().toISOString(),
//     },
//     {
//       title: 'Support Message',
//       message: 'Our team will get back to you shortly.',
//       timestamp: new Date().toISOString(),
//     },
//   ]);

//   // Load user info from AsyncStorage and set userId
//   useEffect(() => {
//     const loadUserDetails = async () => {
//       try {
//         const userData = await AsyncStorage.getItem('user');
//         if (userData) {
//           const parsed = JSON.parse(userData);
//           let id = null;
//           let type = null;

//           if (parsed.user_category === 'merchant') {
//             id = parsed.merchant_id;
//             type = 'merchant';
//           } else if (parsed.user_category === 'customer') {
//             id = parsed.customer_id;
//             type = 'customer';
//           }

//           if (id && type) {
//             setUserId(id);
//             setUserType(type);
//             dispatch(clearUnreadCount(id)); // Clear unread count when screen loads
//           }
//         }
//       } catch (error) {
//         console.error('Failed to load user details:', error);
//       }
//     };

//     loadUserDetails();
//   }, [dispatch]);

//   // Connect to WebSocket when userId and userType are set
//   useEffect(() => {
//     if (!userId || !userType) return;

//     // Callback for incoming messages
//     const handleMessage = (data) => {
//       console.log('📩 Message received:', data);
//       // Optionally update notifications state here
//     };

//     // Connect and set connection status
//     connectWebSocket(
//       userId,
//       userType,
//       handleMessage,
//       () => setWsConnected(true),   // onOpen
//       () => setWsConnected(false)   // onClose
//     );

//     return () => {
//       closeWebSocket();
//       setWsConnected(false);
//     };
//   }, [userId, userType]);

//   const renderItem = ({ item }) => (
//     <View style={styles.notificationCard}>
//       <Text style={styles.notificationTitle}>{item.title}</Text>
//       <Text style={styles.notificationMessage}>{item.message}</Text>
//       <Text style={styles.timestamp}>
//         {new Date(item.timestamp).toLocaleString()}
//       </Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.header}>
//         Notifications{' '}
//         {unreadCount > 0 && <Text style={styles.badge}>({unreadCount})</Text>}
//       </Text>
//       <Text style={{ marginBottom: 8, color: wsConnected ? 'green' : 'red' }}>
//         WebSocket: {wsConnected ? 'Connected' : 'Disconnected'}
//       </Text>
//       <FlatList
//         data={notifications}
//         renderItem={renderItem}
//         keyExtractor={(item, index) => index.toString()}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   badge: {
//     fontSize: 14,
//     color: 'white',
//     backgroundColor: '#F14242',
//     borderRadius: 10,
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     overflow: 'hidden',
//     marginLeft: 8,
//   },
//   notificationCard: {
//     backgroundColor: '#f1f1f1',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   notificationTitle: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   notificationMessage: {
//     fontSize: 14,
//     marginVertical: 4,
//   },
//   timestamp: {
//     fontSize: 12,
//     color: 'gray',
//     textAlign: 'right',
//   },
// });

// export default Notifications;




