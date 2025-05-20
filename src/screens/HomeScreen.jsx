import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Avatar, Text, Button, Card, IconButton, BottomNavigation } from 'react-native-paper';
import Header from '../Components/Header';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get('window');
import { useDispatch, useSelector } from 'react-redux';
import History from './History';
import { clearUnreadCount } from '../Redux/slices/notificationSlice';
import { closeWebSocket, connectWebSocket } from '../Redux/websocket';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState({ user_category: '', id: '' });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userCategory, setUserCategory] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null); // Track user type
  const [wsConnected, setWsConnected] = useState(false); // Track WebSocket status
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0); // Track unread count

  const unreadCount = useSelector((state) =>
    userId ? state.notification.unreadCount[userId] || 0 : 0
  );
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        // console.log("User data from AsyncStorage:", userString);
        if (userString) {
          const user = JSON.parse(userString);
          // console.log("Parsed user data:", user);

          setUser(user);
          setUserCategory(user?.user_category)
          if (user.user_category === 'customer') {
            setLoggedInUserId(user.customer_id);
          }
          if (user.user_category === 'merchant') {
            setLoggedInUserId(user.merchant_id);
          }
          if (user.user_category === 'terminal') {
            setLoggedInUserId(user.terminal_id);
          }
        }
      } catch (error) {
        console.error('Error fetching user details from AsyncStorage:', error);
      }
    };
    fetchUserDetails();
  }, []);

  // Load user info from AsyncStorage and set userId
  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsed = JSON.parse(userData);
          let id = null;
          let type = null;

          if (parsed.user_category === 'merchant') {
            id = parsed.merchant_id;
            type = 'merchant';
          } else if (parsed.user_category === 'customer') {
            id = parsed.customer_id;
            type = 'customer';
          }

          if (id && type) {
            setUserId(id);
            setUserType(type);
            dispatch(clearUnreadCount(id)); // Clear unread count when screen loads
          }
        }
      } catch (error) {
        console.error('Failed to load user details:', error);
      }
    };

    loadUserDetails();
  }, [dispatch]);

  // Connect to WebSocket when userId and userType are set
  useEffect(() => {
    if (!userId || !userType) return;

    // Callback for incoming messages
    const handleMessage = (data) => {
      console.log('📩 Message received:', data);
      setUnreadNotificationCount(data.unread_count || 0); // Update unread count
      // Optionally update notifications state here
    };

    // Connect and set connection status
    connectWebSocket(
      userId,
      userType,
      handleMessage,
      () => setWsConnected(true),   // onOpen
      () => setWsConnected(false)   // onClose
    );

    return () => {
      closeWebSocket();
      setWsConnected(false);
    };
  }, [userId, userType]);


  console.log("Unread Notification Count:", unreadNotificationCount);
  
  // console.log('rrrrrr', user);
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

  // console.log("User Details:", userDetails);
  console.log("User Category:", userCategory);
  console.log(userDetails);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
      {/* Header */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <Header
          username={user?.user_category}
          user={user}
          location={loggedInUserId}
          unreadNotificationCount={unreadNotificationCount}
          avatarUrl="https://randomuser.me/api/portraits/men/1.jpg"
          onNotificationsPress={() => console.log("Notifications Pressed")}
          onSettingsPress={() => console.log("Settings Pressed")}
        />
      </View>

      {/* Award Points Section */}
      <Card style={{ margin: 10, marginBottom: 2, padding: 10, marginTop: 90, backgroundColor: '#fff5f5' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          {userCategory === 'customer' ? 'Redeem Points' : 'Award Points'}
        </Text>
        <View style={{ padding: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {renderActionButton(
              require('../../assets/scanner.png'), // Updated to red theme
              'Redeem BBP',
              () => navigation.navigate('ScanQR', {
                fromScanQR: 'true'
              }),
              { width: 35, height: 35 }
            )}

            {renderActionButton(
              require('../../assets/chooseMerchant.png'), // Updated to blue theme
              userCategory === 'customer' ? 'Choose Merchant' : 'Choose Customer',
              () => navigation.navigate('CustomerSelection', {
                userCategory
              }),
              { width: 35, height: 35 }
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
              { width: 35, height: 35 }
            )}
          </View>
        </View>
      </Card>

      {userCategory === 'customer' && (
        <Card style={{ margin: 10, marginBottom: 20, padding: 10, backgroundColor: '#fff5f5' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Redeem Corporate Points</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {renderActionButton(
              require('../../assets/scanner.png'), // Updated to red theme
              'Reedem Corporate BBP',
              () => navigation.navigate('ScanQR', {
                fromCorporateQR: 'true'
              }),
              { width: 35, height: 35 }
            )}

            {renderActionButton(
              require('../../assets/chooseMerchant.png'), // Updated to blue theme
              'Choose Co. Merchant',
              () => navigation.navigate('CustomerSelection', {
                userCategory,
                chooseCorporateMerchant: 'true'
              }),
              { width: 35, height: 35 }
            )}

          </View>
        </Card>
      )}

      {userCategory === 'customer' && (
        <Card style={{ margin: 10, marginBottom: 20, padding: 10, backgroundColor: '#fff5f5' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Redeem Global Points</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {renderActionButton(
              require('../../assets/scanner.png'), // Updated to red theme
              'Reedem G BBP',
              () => navigation.navigate('ScanQR', {
                fromGlobalQR: 'true'
              }),
              { width: 35, height: 35 }
            )}

            {renderActionButton(
              require('../../assets/chooseMerchant.png'), // Updated to blue theme
              'Choose Merchant',
              () => navigation.navigate('CustomerSelection', {
                userCategory,
                chooseGlobalMerchant: 'true'
              }),
              { width: 35, height: 35 }
            )}

            {renderActionButton(
              require('../../assets/points1.png'), // Updated to red theme
              'G Points',
              () => navigation.navigate('PointsScreen',
                {
                  merchantId: null,
                  merchantName: null,
                  fromGPoints: 'true',
                }
              ),
              { width: 35, height: 35 }
            )}

          </View>
        </Card>
      )}


      {/* Transfer Points Section */}
      {userCategory !== 'terminal' &&
        <Card style={{ margin: 10, marginBottom: 20, padding: 10, backgroundColor: '#fff5f5' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Transfer Points</Text>
          <View style={{ padding: 10 }}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {renderActionButton(
                require('../../assets/scanner.png'), // Updated to blue theme
                'Transfer BBP',
                () => navigation.navigate('ScanQR', {
                  fromTransferHome: 'true'
                }),
                { width: 35, height: 35 }
              )}

              {renderActionButton(
                require('../../assets/chooseMerchant.png'), // Updated to red theme
                userCategory === 'customer' ? 'Select Customer' : 'Select Merchant',
                () => navigation.navigate('SelectUser'),
                { width: 35, height: 35 }
              )}

              {renderActionButton(
                require('../../assets/receive.png'), // Updated to blue theme
                'Your QR',
                () => navigation.navigate('ReceivePointsScreen', { userId: userDetails.id }),
                { width: 35, height: 35 } // Custom dimensions
              )}
            </View>
          </View>
        </Card>
      }

      <Card style={{ margin: 10, padding: 15, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, backgroundColor: '#fff5f5' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', padding: 10 }}>
          {userCategory === 'merchant' && (
            renderActionButton(
              require('../../assets/bank.png'),
              'Bank Details',
              () => navigation.navigate("BankDetails"),
              { width: 25, height: 25 } // Smaller icon dimensions
            )
          )}

          {renderActionButton(
            require('../../assets/help.png'),
            'Help Section',
            () => navigation.navigate('HelpSection'),
            { width: 25, height: 25 } // Smaller icon dimensions
          )}

         {userCategory !== 'terminal' && userCategory !== 'merchant' &&
            renderActionButton(
              require('../../assets/mobile.png'),
              'Change Mobile no.',
              () => navigation.navigate('ChangeMobileNo', { userId: userDetails.id }),
              { width: 25, height: 25 } // Smaller icon dimensions
            )
          } 

          {userCategory === 'terminal' &&
            renderActionButton(
              require('../../assets/receive.png'),
              'Your QR',
              () => navigation.navigate('ReceivePointsScreen', { userId: userDetails.id }),
              { width: 25, height: 25 } // Smaller icon dimensions
            )
          }
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', padding: 10, marginTop: 10 }}>
          {userCategory !== 'terminal' &&
            renderActionButton(
              require('../../assets/yourDetails.png'),
              'Your Details',
              () => navigation.navigate("MerchantForm"),
              { width: 25, height: 25 } // Smaller icon dimensions
            )
          }

          {renderActionButton(
            require('../../assets/bank1.png'),
            'Transaction History',
            () => navigation.navigate("History"),
            { width: 25, height: 25 } // Smaller icon dimensions
          )}      
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', padding: 10, marginTop: 10 }}>
     {userCategory !== 'terminal' && userCategory !== 'customer' &&
            renderActionButton(
              require('../../assets/mobile.png'),
              'Change Mobile no.',
              () => navigation.navigate('ChangeMobileNo', { userId: userDetails.id }),
              { width: 25, height: 25 } // Smaller icon dimensions
            )
          }

           {userCategory !== 'terminal' && userCategory !== 'customer' &&
            renderActionButton(
              require('../../assets/bank1.png'),
              'Payment',
              () => navigation.navigate('PaymentsHistory'),
              { width: 25, height: 25 } // Smaller icon dimensions
            )
          }
</View>

        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', padding: 10, marginTop: 10 }}>
          {userCategory === 'merchant' &&
            renderActionButton(
              require('../../assets/bank1.png'),
              'Cashout Points',
              () => navigation.navigate('Cashout'),
              { width: 25, height: 25 } // Smaller icon dimensions
            )
          }
        </View> */}
      </Card>
    </ScrollView>
  );
};

export default HomeScreen;