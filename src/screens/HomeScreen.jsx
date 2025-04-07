/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Avatar, Text, Button, Card, IconButton, BottomNavigation } from 'react-native-paper';
import Header from '../Components/Header';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get('window');
import { useDispatch } from 'react-redux';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState({ user_category: '', id: '' });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userCategory, setUserCategory] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          console.log("Parsed user data:", user);

          // Set the loggedInUser state
          setLoggedInUser(user);

          // Extract and set the user_category
          const category = user.user_category || 'User';
          setUserCategory(category);

          // Set user details
          setUserDetails({
            user_category: category,
            id: user.customer_id || user.merchant_id || user.corporate_id || 'N/A',
          });
        }
      } catch (error) {
        console.error('Error fetching user details from AsyncStorage:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const renderActionButton = (iconSource, label, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={{ alignItems: 'center', flex: 1, padding: 10 }}>
        <Image
          source={iconSource}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
        <Text style={{ marginTop: 5 }}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  console.log("User Details:", userDetails);
  console.log("User Category:", userCategory);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
      {/* Header */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <Header
          username={userDetails.user_category}
          location={`ID: ${userDetails.id}`}
          avatarUrl="https://randomuser.me/api/portraits/men/1.jpg"
          onNotificationsPress={() => console.log("Notifications Pressed")}
          onSettingsPress={() => console.log("Settings Pressed")}
        />
      </View>

      {/* Award Points Section */}
      <Card style={{ margin: 10, marginBottom: 2, padding: 10, marginTop: 90 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          {userCategory === 'customer' ? 'Redeem Points' : 'Award Points'}
        </Text>
        <View style={{ padding: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {renderActionButton(
              require('../../assets/scanner.png'),
              'Scan QR',
              () => navigation.navigate('ScanQR')
            )}

            {renderActionButton(
              require('../../assets/neha.jpg'),
              userCategory === 'customer' ? 'Choose Merchant' : 'Choose Customer',
              () => navigation.navigate('CustomerSelection')
            )}

            {renderActionButton(
              require('../../assets/neha.jpg'),
              'Points',
              () => navigation.navigate('PointsScreen')
            )}
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
          <Text style={{ textAlign: 'center' }}>My ID: {userDetails.id}</Text>
        </View>
      </Card>

      {/* Transfer Points Section */}
      <Card style={{ margin: 10, marginBottom: 20, padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Transfer Points</Text>
        <View style={{ padding: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {renderActionButton(
              require('../../assets/scanner.png'),
              'Transfer',
              () => console.log("Transfer pressed")
            )}

            {renderActionButton(
              require('../../assets/neha.jpg'),
              'Select User',
              () => console.log("Select User pressed")
            )}

            {renderActionButton(
              require('../../assets/neha.jpg'),
              'Receive',
              () => navigation.navigate('ReceivePoints', { userId: userDetails.id })
            )}
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

// Scan QR Screen
const ScanQRScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f3f3' }}>
    <Image
      source={require('../../assets/neha.jpg')}
      style={{ width: 200, height: 200 }}
    />
    <Text style={{ marginTop: 20 }}>Scan QR Code</Text>
  </View>
);

// History Screen
const HistoryScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f3f3' }}>
    <Text>Transaction History</Text>
  </View>
);

// Bottom Navigation
const MainNavigator = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline'
    },
    {
      key: 'scanQR',
      title: 'Scan',
      focusedIcon: 'qrcode-scan',
      unfocusedIcon: 'qrcode'
    },
    {
      key: 'history',
      title: 'History',
      focusedIcon: 'history',
      unfocusedIcon: 'history'
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    scanQR: ScanQRScreen,
    history: HistoryScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{ backgroundColor: 'white' }}
      activeColor="#6A1B9A"
      inactiveColor="#888"
    />
  );
};

export default MainNavigator;