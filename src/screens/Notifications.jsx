
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Touchable, TouchableOpacity } from 'react-native';
import { fetchNotificationById } from '../Redux/slices/AllNotificationSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Button, Dialog } from 'react-native-paper';

const Notifications = () => {
  const [userId, setUserId] = useState(null);
  const [userCategory, setUserCategory] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [notificationDailogue, setNotificationDailogue] = useState(false);
  const [notificationData, setNotificationData] = useState(null);
  const dispatch = useDispatch();
  const fetchDetails = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        // console.log("Parsed user data:", parsedData);
        if (parsedData.user_category === 'customer') {
          setUserCategory('customer');
          setUserId(parsedData.customer_id);
        } else if (parsedData.user_category === 'merchant') {
          setUserCategory('merchant');
          setUserId(parsedData.merchant_id);
        }  else if (parsedData.user_category === 'terminal') {
          setUserCategory('merchant');
          setUserId(parsedData.merchant_id);
          console.log('terminal merchantt', parsedData.merchant_id);
        }
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

useEffect(() => {
  fetchDetails();
}, [userId]);


const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM

  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
};



const handleNotificationPress = (item) => () => {
  setNotificationDailogue(true);
  setNotificationData(item);
  console.log("Notification pressed:", item);
}

useFocusEffect(
  useCallback(() => {
    const fetchNotification = async () => {
      try {
        const response = await dispatch(fetchNotificationById({
          user_id: userId,
          user_category: userCategory,
        }));
        console.log("Notification response:", response?.payload);
        setNotifications(response?.payload);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (userId && userCategory) {
      fetchNotification();
    }
  }, [userId, userCategory])
);


console.log("Notifications:", notifications);

  const renderItem = ({ item }) => (
   <TouchableOpacity onPress={handleNotificationPress(item)}>
  <View style={styles.notificationCard}>
    <Text style={styles.notificationTitle}>{item.title}</Text>
    <Text style={styles.notificationMessage}>{item.message}</Text>
    <Text style={styles.timestamp}>
  {formatDateTime(item.created_at)}
</Text>

  </View>
</TouchableOpacity>
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

      <Dialog visible={notificationDailogue} onDismiss={() => setNotificationDailogue(false)}>
          <Dialog.Title style={styles.notificationTitle}>{notificationData?.title}</Dialog.Title>
          <Dialog.Content>
            <Text>{notificationData?.description}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setNotificationDailogue(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
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

