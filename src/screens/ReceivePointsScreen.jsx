import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { useDispatch } from 'react-redux';

const ReceivePointsScreen = ({ route }) => {
  const userId = route?.params?.userId || 'N/A';
  const qrValue = `receive:${userId}`;

  const [loggedInUserId,setLoggedInUserId]=useState(null);
  const [user,setUser]=useState(null);


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        console.log("User data from AsyncStorage:", userString);
        if (userString) {
          const user = JSON.parse(userString);
          console.log("Parsed user data:", user);
          setUser(user);
          if(user.user_category === 'customer') {
            setLoggedInUserId(user.customer_id);
          }
          if(user.user_category === 'merchant') {
            setLoggedInUserId(user.merchant_id);
          }
          if(user.user_category === 'terminal') {
            setLoggedInUserId(user.terminal_id);
          }
        }
      } catch (error) {
        console.error('Error fetching user details from AsyncStorage:', error);
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan this QR to Receive Points</Text>
      <QRCode
        value={qrValue}
        size={200}
      />
      <Text style={styles.userId}>User ID: {loggedInUserId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f3f3',
  },
  title: {
    fontSize: 18, marginBottom: 20,
  },
  userId: {
    marginTop: 20, fontSize: 16,
  },
});

export default ReceivePointsScreen;
