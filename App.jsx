import React, { useEffect, useState, useRef } from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import {
  NavigationContainer
} from '@react-navigation/native';
import {
  Provider as PaperProvider
} from 'react-native-paper';
import {
  createStackNavigator
} from '@react-navigation/stack';
import {
  ActivityIndicator,
  StatusBar,
  useColorScheme,
  View,
  Animated,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Easing,
  Platform,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Redux
import {
  Provider
} from 'react-redux';
import store from './src/Redux/store';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import CustomerSelection from './src/screens/CustomerSelection';
import ScanQR from './src/screens/ScanQR';
import PointsScreen from './src/screens/PointsScreen';
import ShowPoints from './src/screens/ShowPoints';
import Awards from './src/screens/Awards';
import MerchantForm from './src/screens/MerchantForm';
import RedeemPoints from './src/screens/RedeemPoints';
import transfer from './src/screens/transfer';
import Transferpointstomerchant from './src/screens/Transferpointstomerchant';
import History from './src/screens/History';
import TransferPoints from './src/Components/TransferPoints';
import SelectUser from './src/screens/SelectUser';
import BankDetails from './src/screens/BankDetails';
import HelpSection from './src/screens/HelpSection';
import ChangeMobileNo from './src/screens/ChangeMobileNo';
import ReceivePointsScreen from './src/screens/ReceivePointsScreen';
import Profile from './src/screens/Profile';
import Payments from './src/screens/Payments';
import PaymentsHistory from './src/screens/PaymentsHistory';
import Cashout from './src/screens/Cashout';
import Notifications from './src/screens/Notifications';

// WebSocket
import {
  closeWebSocket,
  connectWebSocket
} from './src/Redux/websocket';

const Stack = createStackNavigator();

const NotificationBanner = ({ message, onClose }) => {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        if (onClose) onClose();
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, [message]);

  return (
    <Animated.View style={[styles.bannerContainer, { transform: [{ translateY }] }]}>
      <TouchableOpacity style={styles.bannerTouchable} activeOpacity={0.8} onPress={onClose}>
        <Text style={styles.bannerText} numberOfLines={2} ellipsizeMode="tail">
          {message}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [initialRoute, setInitialRoute] = useState('Login');
  const [isLoading, setIsLoading] = useState(true);
  const [currentRoute, setCurrentRoute] = useState('Login');
  const navigationRef = useRef();
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [showBanner, setShowBanner] = useState(false);


 useEffect(() => {
    const createChannel = async () => {
      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });
      }
    };

    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    };

    const getToken = async () => {
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);
      // Optionally send token to backend
    };

    const onMessageListener = messaging().onMessage(async remoteMessage => {
      Alert.alert('New Notification', JSON.stringify(remoteMessage.notification));
    });

    // Run setup functions
    createChannel();
    requestPermission();
    getToken();

    return () => {
      onMessageListener();
    };
  }, []);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          setUserType(user?.user_category);
          if (user.user_category === 'customer') setUserId(user.customer_id);
          else if (user.user_category === 'merchant') setUserId(user.merchant_id);
          else if (user.user_category === 'terminal') setUserId(user.terminal_id);
        }
      } catch (error) {
        console.error('Error fetching user details from AsyncStorage:', error);
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        setInitialRoute(user ? 'Home' : 'Login');
      } catch (error) {
        console.error('Error reading user data:', error);
        setInitialRoute('Login');
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  // Remove useCallback and define as a regular function so it always has latest state setters
  function showNotificationBanner(title, description) {
    const message = `${title ? title + ': ' : ''}${description || 'You have a new notification.'}`;
    setNotificationMsg(message);
    setShowBanner(true);
  }

  useEffect(() => {
    const connectAndListen = async () => {
      try {
        if (userId && userType) {
          connectWebSocket(
            userId,
            userType,
            (data) => {
              try {
                setUnreadNotificationCount(data.unread_count || 0);
                if (data.new_notification) {
                  console.log('New notification:', data.new_notification);

                  const { title, description } = data.new_notification;
                  showNotificationBanner(title, description);
                }
              } catch (notifErr) {
                console.error('Error handling notification:', notifErr);
              }
            },
            () => {
              try {
                console.log('WebSocket connected');
                // You can show a notification or update state here if needed
              } catch (wsConnectErr) {
                console.error('Error in WebSocket connected callback:', wsConnectErr);
              }
            },
            () => {
              try {
                console.log('WebSocket disconnected');
              } catch (wsDisconnectErr) {
                console.error('Error in WebSocket disconnected callback:', wsDisconnectErr);
              }
            }
          );
        }
      } catch (err) {
        console.error('Error in WebSocket connection logic:', err);
      }
    };

    connectAndListen();

    return () => {
      if (!userId || !userType) {
        closeWebSocket();
      }
    };
  }, [userId, userType]); // Remove showNotificationBanner from dependency array

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
{showBanner && notificationMsg !== '' && (
  <NotificationBanner
    message={
      <View>
        <Text style={{ fontWeight: 'bold',color:'white' }}>New Notification</Text>
        <View style={{ height: 4 }} /> {/* Acts like a line break */}
        <Text style={{color:'white'}}>{notificationMsg}</Text>
      </View>
    }
    onClose={() => {
      setShowBanner(false);
      setNotificationMsg('');
      // Navigate to Notifications screen when banner is pressed
      if (navigationRef.current) {
        navigationRef.current.navigate('Notifications');
      }
    }}
  />
)}


      <Provider store={store}>
        <PaperProvider>
          <NavigationContainer
            ref={navigationRef}
            onStateChange={() => {
              const route = navigationRef.current?.getCurrentRoute();
              setCurrentRoute(route?.name);
            }}
          >
            {(currentRoute !== 'Login' && currentRoute !== 'Register' && currentRoute !== 'PointsScreen' && currentRoute !== 'ShowPoints'
              && currentRoute !=='History' && currentRoute !== 'MerchantForm'
            ) && (
              <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor="rgb(241, 66, 66)"
              />
            )}
            <Stack.Navigator initialRouteName={initialRoute}>
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
              <Stack.Screen name="CustomerSelection" component={CustomerSelection} options={{ headerShown: false }} />
              <Stack.Screen name="ScanQR" component={ScanQR} options={{ headerShown: false }} />
              <Stack.Screen name="PointsScreen" component={PointsScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ShowPoints" component={ShowPoints} options={{ headerShown: false }} />
              <Stack.Screen name="Awards" component={Awards} options={{ headerShown: false }} />
              <Stack.Screen name="MerchantForm" component={MerchantForm} options={{ headerShown: false }} />
              <Stack.Screen name="RedeemPoints" component={RedeemPoints} options={{ headerShown: false }} />
              <Stack.Screen name="transfer" component={transfer} options={{ headerShown: false }} />
              <Stack.Screen name="Transferpointstomerchant" component={Transferpointstomerchant} options={{ headerShown: false }} />
              <Stack.Screen name="History" component={History} options={{ headerShown: false }} />
              <Stack.Screen name="TransferPoints" component={TransferPoints} options={{ headerShown: false }} />
              <Stack.Screen name="SelectUser" component={SelectUser} options={{ headerShown: false }} />
              <Stack.Screen name="BankDetails" component={BankDetails} options={{ headerShown: false }} />
              <Stack.Screen name="HelpSection" component={HelpSection} options={{ headerShown: false }} />
              <Stack.Screen name="ChangeMobileNo" component={ChangeMobileNo} options={{ headerShown: false }} />
              <Stack.Screen name="ReceivePointsScreen" component={ReceivePointsScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
              <Stack.Screen name="Payments" component={Payments} options={{ headerShown: false }} />
              <Stack.Screen name="PaymentsHistory" component={PaymentsHistory} options={{ headerShown: false }} />
              <Stack.Screen name="Cashout" component={Cashout} options={{ headerShown: false }} />
              <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
bannerContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    right: 20,
    backgroundColor: '#004BFF', // bright red for error/warning
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 10, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    zIndex: 9999,
    alignSelf: 'center',
  },

  bannerTouchable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bannerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    width: width - 80,
  },
});

export default App;





