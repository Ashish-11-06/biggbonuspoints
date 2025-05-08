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
import History from './History';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState({ user_category: '', id: '' });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userCategory, setUserCategory] = useState(null);
  const [loggedInUserId,setLoggedInUserId]=useState(null);
  const [user,setUser]=useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        console.log("User data from AsyncStorage:", userString);
        if (userString) {
          const user = JSON.parse(userString);
          console.log("Parsed user data:", user);
          setUser(user);
          setUserCategory(user?.user_category)
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

console.log('rrrrrr',user);
  const renderActionButton = (iconSource, label, onPress, customStyle = {}) => (
    <TouchableOpacity onPress={onPress}>
      <View style={{ alignItems: 'center', flex: 1, padding: 10 }}>
        <Image
          source={iconSource}
          style={{ width: 50, height: 50, borderRadius: 25, ...customStyle }}
        />
        <Text style={{ marginTop: 5 }}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  console.log("User Details:", userDetails);
  console.log("User Category:", userCategory);
console.log(userDetails);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
      {/* Header */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <Header
          username={user?.user_category}
          // user={userDetails.username}
          location={loggedInUserId}
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
              require('../../assets/scanner.png'), // Updated to red theme
              'Scan QR',
              () => navigation.navigate('ScanQR',{
                fromScanQR:'true'
              }),
              {width:35,height:35} 
            )}

            {renderActionButton(
              require('../../assets/chooseMerchant.png'), // Updated to blue theme
              userCategory === 'customer' ? 'Choose Merchant' : 'Choose Customer',
              () => navigation.navigate('CustomerSelection', { userCategory }),
              {width:35,height:35} 
            )}

            {renderActionButton(
              require('../../assets/points1.png'), // Updated to red theme
              'Points',
              () => navigation.navigate('PointsScreen',
                {
                  merchantId: null,
                  merchantName: null,
                  fromHomeScreen: 'true',
                }
              ),
              {width:35,height:35} 
            )}
          </View>
        </View>
        {/* <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
          <Text style={{ textAlign: 'center' }}>My ID: {userDetails.id}</Text>
        </View> */}
      </Card>

      {/* Transfer Points Section */}
      {userCategory !== 'terminal' && 
      <Card style={{ margin: 10, marginBottom: 20, padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Transfer Points</Text>
        <View style={{ padding: 10 }}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {renderActionButton(
              require('../../assets/transfer.png'), // Updated to blue theme
              'Transfer BBP',
              () => navigation.navigate('ScanQR',{
                fromTransferHome:'true'
              }),
              {width:35,height:35} 
            )}

            {renderActionButton(
              require('../../assets/chooseMerchant.png'), // Updated to red theme
              userCategory === 'customer' ? 'Select Customer' : 'Select Merchant',
              () => navigation.navigate('SelectUser'),
              {width:35,height:35} 
            )}

            {renderActionButton(
              require('../../assets/receive.png'), // Updated to blue theme
              'Your QR',
              () => navigation.navigate('ReceivePointsScreen', { userId: userDetails.id }),
              {width:35,height:35} // Custom dimensions
            )}
          </View>
        </View>
      </Card>
}


      <Card style={{ margin: 10, marginBottom: 20, padding: 10 }}>
        {/* <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Transfer Points</Text> */}
        <View style={{ padding: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {renderActionButton(
              require('../../assets/bank.png'), // Updated to red theme
              'Bank Details',
              () => navigation.navigate("BankDetails"),
              { width: 35, height: 35 } // Custom dimensions
            )}

            {renderActionButton(
              require('../../assets/help.png'), // Updated to blue theme
              'Help Section',
              () => navigation.navigate('HelpSection'),
              { width: 35, height: 35 } // Custom dimensions
            )}

{userCategory !== 'terminal' &&
  renderActionButton(
    require('../../assets/mobile.png'), // Updated to red theme
    'Mobile No.',
    () => navigation.navigate('ChangeMobileNo', { userId: userDetails.id }),
    { width: 35, height: 35 } // Custom dimensions
  )
}

{userCategory === 'terminal' &&
renderActionButton(
              require('../../assets/receive.png'), // Updated to blue theme
              'Your QR',
              () => navigation.navigate('ReceivePointsScreen', { userId: userDetails.id }),
              {width:35,height:35} // Custom dimensions
            )}
          </View>
        </View>
        <View style={{ padding: 10 }}>
        <View style={{ 
    flexDirection: 'row',
    justifyContent:'space-between' 
    // justifyContent: loggedInUser?.user_category === 'merchant' ? 'space-between' : 'flex-start' 
  }}>
    {userCategory !== 'terminal' &&
            renderActionButton(
              require('../../assets/yourDetails.png'), // Updated to blue theme
              'Your Details',
              () => navigation.navigate("MerchantForm"),
              { width: 35, height: 35 } // Custom dimensions
            )}
{renderActionButton(
              require('../../assets/bank1.png'), // Updated to blue theme
              'History',
              () => navigation.navigate("History"),
              { width: 35, height: 35 } // Custom dimensions
            )}
{userCategory !== 'terminal' && userCategory !== 'customer'  && (
  renderActionButton(
    require('../../assets/bank1.png'), // Updated to blue theme
    'Payment',
    () => navigation.navigate('PaymentsHistory'),
    { width: 35, height: 35 } // Custom dimensions
  )
)}

{ userCategory === 'customer'  && (
  renderActionButton(
    require('../../assets/cashout.png'), // Updated to blue theme
    'Cashout Points',
    () => navigation.navigate('Cashout'),
    { width: 35, height: 35 } // Custom dimensions
  )
)}


          </View>
        </View>
        <View style={{ padding: 10 }}>
        <View style={{ 
    flexDirection: 'row',
    justifyContent:'space-between' 
    // justifyContent: loggedInUser?.user_category === 'merchant' ? 'space-between' : 'flex-start' 
  }}>
    { userCategory === 'merchant'  && (
  renderActionButton(
    require('../../assets/bank1.png'), // Updated to blue theme
    'Cashout Points',
    () => navigation.navigate('Cashout'),
    { width: 35, height: 35 } // Custom dimensions
  )
)}
    </View>
    </View>
      </Card>


      {/* <Card style={{ margin: 10, marginBottom: 20, padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Transfer Points</Text>
        <View style={{ padding: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {renderActionButton(
              require('../../assets/scanner.png'), // Updated to blue theme
              'MerchantForm',
              () => navigation.navigate("MerchantForm")
            )}
          </View>
        </View>
      </Card> */}

    </ScrollView>
  );
};

// Scan QR Screen
// const ScanQRScreen = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f3f3' }}>
//     <Image
//       source={require('../../assets/neha.jpg')}
//       style={{ width: 200, height: 200 }}
//     />
//     <Text style={{ marginTop: 20 }}>Scan QR Code</Text>
//   </View>
// );

// // History Screen
// const HistoryScreen = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f3f3' }}>
//     <Text>Transaction History</Text>
//   </View>
// );

// Bottom Navigation
// const MainNavigator = () => {
//   const [index, setIndex] = useState(0);
//   const [routes] = useState([
//     {
//       key: 'home',
//       title: 'Home',
//       focusedIcon: 'home',
//       IconButton: 'home-outline'
//     },
//     {
//       key: 'scanQR',
//       title: 'Scan',
//       focusedIcon: 'qrcode-scan',
//       unfocusedIcon: 'qrcode'
//     },
//     {
//       key: 'history',
//       title: 'History',
//       focusedIcon: 'history',
//       unfocusedIcon: 'history'
//     },
//   ]);

//   const renderScene = BottomNavigation.SceneMap({
//     home: HomeScreen,
//     scanQR: ScanQRScreen,
//     history: History,
//   });

//   return (
//     <BottomNavigation
//       navigationState={{ index, routes }}
//       onIndexChange={setIndex}
//       renderScene={renderScene}
//       barStyle={{ backgroundColor: 'white' }}
//       activeColor="#6A1B9A"
//       inactiveColor="#888"
//     />
//   );
// };

export default HomeScreen
;