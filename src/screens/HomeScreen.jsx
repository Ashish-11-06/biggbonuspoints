import React, { useState } from 'react';
import { View, ScrollView, Image, Dimensions,TouchableOpacity } from 'react-native';
import { Avatar, Text, Button, Card, IconButton, BottomNavigation } from 'react-native-paper';
import Header from '../Components/Header';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from "@react-navigation/native";
const { width } = Dimensions.get('window');


const HomeScreen = () => {
  const navigation = useNavigation();
  return(
  <ScrollView style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
    {/* Header */}
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
      <Header 
        username="John Doe"
        location="New York, USA"
        avatarUrl="https://randomuser.me/api/portraits/men/1.jpg"
        onNotificationsPress={() => console.log("Notifications Pressed")}
        onSettingsPress={() => console.log("Settings Pressed")}
      />
    </View>
    
    {/* Reedem points */}
      <Card style={{ margin: 10, marginBottom:2, padding: 10, marginTop: 90 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Award Points</Text>
        <View style={{ padding: 10 }}>
      {/* First Row */}
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{ alignItems: 'center', flex: 1, padding: 10 }}>
          <Image source={require('../../assets/neha.jpg')} style={{ width: 50, height: 50, borderRadius: 25 }} />
          <Text>Scan QR</Text>
        </View>
        
        <TouchableOpacity onPress={() => navigation.navigate('CustomerSelection')}>
            <View style={{ alignItems: 'center', flex: 1, padding: 10 }}>
              <Image source={require('../../assets/neha.jpg')} style={{ width: 100, height: 50, borderRadius: 25 }} />
              <Text style={{ width: 120, height: 50, borderRadius: 25 }}>Choose Customer</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PointsScreen')}>
        <View style={{ alignItems: 'center', flex: 1, padding: 10 }}>
          <Image source={require('../../assets/neha.jpg')} style={{ width: 50, height: 50, borderRadius: 25 }} />
          <Text style={{ alignItems: 'center', width:40}}>points</Text>
        </View>
        </TouchableOpacity>
      </View>
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: -20 }}>
        <Text style={{ textAlign: 'center', flex: 1 }}>My ID: ABC008790</Text>
      </View>
      </Card>

      <Card style={{ margin: 10, marginBottom:2, padding: 10, paddingBottom: 0 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Transfer Points</Text>
        <View style={{ padding: 10, paddingBottom: 0 }}>
      {/* Second Row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{ alignItems: 'center', flex: 1, padding: 10 }}>
          <Image source={require('../../assets/neha.jpg')} style={{ width: 50, height: 50, borderRadius: 25 }} />
          <Text>Transfer</Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1, padding: 10 }}>
          <Image source={require('../../assets/neha.jpg')} style={{ width: 100, height: 50, borderRadius: 25 }} />
          <Text style={{ width: 70, height: 50, borderRadius: 25 }} >select user</Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1, padding: 10 }}>
          <Image source={require('../../assets/neha.jpg')} style={{ width: 50, height: 50, borderRadius: 25 }} />
          <Text style={{ alignItems: 'center', width:50}}>Recieve</Text>
        </View>
      </View>
    </View>
    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: -20 }}>
        <Text style={{ textAlign: 'center', flex: 1 }}>My ID: ABC008790</Text>
      </View> */}
      </Card>


    {/* Wallet & Rewards */}
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
      <Button mode="contained-tonal" style={{ flex: 1, marginHorizontal: 5 }}>PhonePe Wallet</Button>
      <Button mode="contained-tonal" style={{ flex: 1, marginHorizontal: 5 }}>Rewards</Button>
      <Button mode="contained-tonal" style={{ flex: 1, marginHorizontal: 5 }}>Refer & Get ₹100</Button>
    </View>

    {/* Recharge & Pay Bills */}
    <Card style={{ margin: 10, padding: 10 }}>
      <Text variant="titleMedium">Recharge & Pay Bills</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 }}>
        <Button icon="cellphone" mode="contained-tonal" style={{ width: width / 3 - 20, marginBottom: 10 }}>Mobile</Button>
        <Button icon="satellite-uplink" mode="contained-tonal" style={{ width: width / 3 - 20, marginBottom: 10 }}>DTH</Button>
        <Button icon="flash" mode="contained-tonal" style={{ width: width / 3 - 20, marginBottom: 10 }}>Electricity</Button>
        <Button icon="credit-card" mode="contained-tonal" style={{ width: width / 3 - 20, marginBottom: 10 }}>Credit Card</Button>
        <Button icon="home" mode="contained-tonal" style={{ width: width / 3 - 20, marginBottom: 10 }}>Rent</Button>
        <Button icon="bank" mode="contained-tonal" style={{ width: width / 3 - 20, marginBottom: 10 }}>Loan</Button>
        <Button icon="school" mode="contained-tonal" style={{ width: width / 3 - 20, marginBottom: 10 }}>Education</Button>
        <Button mode="contained-tonal" style={{ width : width / 3 - 20, marginBottom: 10 }}>See All</Button>
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
    history: HistoryScreen,
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
