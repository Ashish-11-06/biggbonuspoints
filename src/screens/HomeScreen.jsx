/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Avatar, Text, Button, Card, IconButton, BottomNavigation } from 'react-native-paper';
import Header from '../Components/Header';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get('window');
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchCustomerPointsById } from '../Redux/slices/customerPointsSlice';
import { useDispatch } from 'react-redux';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState({ user_category: '', id: '' });
const dispatch=useDispatch();

  React.useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        console.log('user',user)
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserDetails({
            user_category: parsedUser.user_category || '',
            id: parsedUser.customer_id || parsedUser.merchant_id || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user details from AsyncStorage:', error);
      }
    };

    fetchUserDetails();
  }, []);

console.log('user details',userDetails);

useEffect (() => {
  const fetchCustomerPoints = async () => {
    try {
      const response = await dispatch(fetchCustomerPointsById(userDetails.id));
      console.log('response',response)
      } catch (error) {
        console.error('Error fetching customer points:', error);
        }
        }
        }, [userDetails.id, dispatch]);
      

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
      
      {/* Reedem points */}
      <Card style={{ margin: 10, marginBottom: 2, padding: 10, marginTop: 90 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Award Points</Text>
        <View style={{ padding: 10 }}>
          {/* First Row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => navigation.navigate('ScanQR')}>
              <View style={{ alignItems: 'center', flex: 1, padding: 10 }}>
                <Image source={require('../../assets/neha.jpg')} style={{ width: 50, height: 50, borderRadius: 25 }} />
                <Text>Scan QR</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CustomerSelection')}>
              <View style={{ alignItems: 'center', flex: 1, padding: 10 }}>
                <Image source={require('../../assets/neha.jpg')} style={{ width: 100, height: 50, borderRadius: 25 }} />
                <Text style={{ width: 120, height: 50, borderRadius: 25 }}>Choose Customer</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('PointsScreen')}>
              <View style={{ alignItems: 'center', flex: 1, padding: 10 }}>
                <Image source={require('../../assets/neha.jpg')} style={{ width: 50, height: 50, borderRadius: 25 }} />
                <Text style={{ alignItems: 'center', width: 40 }}>points</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: -20 }}>
          <Text style={{ textAlign: 'center', flex: 1 }}>My ID: ABC008790</Text>
        </View>
      </Card>

      <Card style={{ margin: 10, marginBottom: 2, padding: 10, paddingBottom: 0 }}>
        
       <View> <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Transfer Points</Text></View>
        <View style={{ padding: 10, paddingBottom: 0 }}>
          {/* Second Row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => navigation.navigate('transfer')}>
            <View style={{ alignItems: 'center', flex: 1, padding: 10 }}>
              <Image source={require('../../assets/neha.jpg')} style={{ width: 50, height: 50, borderRadius: 25 }} />
              <Text>Transfer</Text>
            </View>
            </TouchableOpacity>
            <View style={{ alignItems: 'center', flex: 1, padding: 10 }}>
              <Image source={require('../../assets/neha.jpg')} style={{ width: 100, height: 50, borderRadius: 25 }} />
              <Text style={{ width: 70, height: 50, borderRadius: 25 }}>select user</Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1, padding: 10 }}>
              <Image source={require('../../assets/neha.jpg')} style={{ width: 50, height: 50, borderRadius: 25 }} />
              <Text style={{ alignItems: 'center', width: 50 }}>Recieve</Text>
            </View>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

// Scan QR Screen (Placeholder)
const ScanQRScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f3f3' }}>
    <Image source={require('../../assets/neha.jpg')} style={{ width: 200, height: 200 }} />
    <Text style={{ marginTop: 20 }}>Scan QR Code</Text>
  </View>
);

// History Screen (Placeholder)
const HistoryScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f3f3' }}>
    <Text>Transaction History</Text>
  </View>
);

// Bottom Navigation
const MainNavigator = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'scanQR', title: 'Scan', icon: 'qrcode' },
    { key: 'history', title: 'History', icon: 'history' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    scanQR: ScanQRScreen,
    history: () => {
      // Instead of rendering history inline, navigate to the full screen
      useEffect(() => {
        navigation.navigate('HistoryPage');
      }, []);
      return null; // No content here, it's just redirecting
    },
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{ backgroundColor: 'white' }}
      shifting={false}
      activeColor="#6A1B9A"
      inactiveColor="#888"
    />
  );
};

export default MainNavigator;