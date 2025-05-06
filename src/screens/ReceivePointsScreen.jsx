import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { useDispatch } from 'react-redux';

const ReceivePointsScreen = ({ route }) => {
  
  const userId = route?.params?.userId || 'N/A';
  // const qrValue = `receive:${userId}`;

  const [loggedInUserId,setLoggedInUserId]=useState(null);
  const [user,setUser]=useState(null);
  const [qrValue, setQrValue] = useState(`receive:${userId}`);


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        console.log("User data from AsyncStorage:", userString);
        if (userString) {
          const user = JSON.parse(userString);
          console.log("Parsed user data:", user);
          setUser(user);
          setQrValue(`receive:${user.merchant_id || user.customer_id}`);
          console.log("User data set in state:", user);
          console.log("QR Value set in state:", qrValue);
        }
      } catch (error) {
        console.error('Error fetching user details from AsyncStorage:', error);
      }
    };
    fetchUserDetails();
  }, []);

  console.log("User data from dddd AsyncStorage:", user);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan this QR</Text>
      <QRCode
        value={qrValue}
        size={200}
      />
      <Text style={styles.userId}>User ID: {user ? user.merchant_id || user.customer_id : ''}</Text>
      <Text style={styles.userId}>User name: {user ? `${user.first_name} ${user.last_name} `: ''}</Text>
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
