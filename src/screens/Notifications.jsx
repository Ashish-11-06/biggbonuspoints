// src/components/NotificationComponent.js

import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { connectWebSocket, closeWebSocket } from '../websocket/websocket';

export default function Notifications() {
  useEffect(() => {
    const handleMessage = (data) => {
      console.log('📩 Message received:', data);
      Alert.alert('New Notification', data.message || 'You have a new update!');
    };

    connectWebSocket(handleMessage);

    return () => {
      closeWebSocket();
    };
  }, []);

  return (
    <View>
      <Text>Listening for notifications...</Text>
    </View>
  );
}






// import React, { useState } from 'react';
// import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';

// const Notifications = () => {
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

//   const renderItem = ({ item }) => (
//     <View style={styles.notificationCard}>
//       <Text style={styles.notificationTitle}>{item.title}</Text>
//       <Text style={styles.notificationMessage}>{item.message}</Text>
//       <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.header}>Notifications</Text>
//       <FlatList
//         data={notifications}
//         renderItem={renderItem}
//         keyExtractor={(item, index) => index.toString()}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     </SafeAreaView>
//   );
// };

// export default Notifications;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f4f6fc',
//     paddingHorizontal: 16,
//     paddingTop: 20,
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: '#F14242',
//   },
//   notificationCard: {
//     backgroundColor: '#fff',
//     padding: 16,
//     marginBottom: 12,
//     borderRadius: 10,
//     elevation: 3,
//   },
//   notificationTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#004BFF',
//     marginBottom: 6,
//   },
//   notificationMessage: {
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 4,
//   },
//   timestamp: {
//     fontSize: 12,
//     color: '#888',
//     textAlign: 'right',
//   },
// });
