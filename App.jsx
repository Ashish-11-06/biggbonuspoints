import React, { useEffect, useState } from 'react';
import './ReactotronConfig';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, useColorScheme, ActivityIndicator, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (__DEV__) {
  require('./ReactotronConfig');
}

// Import your screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CustomerSelection from './src/screens/CustomerSelection';
import { Provider } from 'react-redux';
import store from './src/Redux/store';
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
import selectuser from './src/screens/SelectUser';
import paymentsHistory from './src/screens/paymentsHistory';
import Payments from './src/screens/Payments';
const Stack = createStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [initialRoute, setInitialRoute] = useState('Login');
  const [isLoading, setIsLoading] = useState(true);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
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
            <Stack.Screen name="TransferPoints" component={TransferPoints} options={{ headerShown: false }} />
            <Stack.Screen name="ReceivePointsScreen" component={ReceivePointsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SelectUser" component={SelectUser} options={{ headerShown: false }} />
            <Stack.Screen name="HelpSection" component={HelpSection} options={{ headerShown: false }} />
            <Stack.Screen name="ChangeMobileNo" component={ChangeMobileNo} options={{ headerShown: false }} />
            <Stack.Screen name="BankDetails" component={BankDetails} options={{ headerShown: false }} />
            <Stack.Screen name="transfer" component={transfer} options={{ headerShown: false }} />
            <Stack.Screen name="Transferpointstomerchant" component={Transferpointstomerchant} options={{ headerShown: false }} />
            <Stack.Screen name="History" component={History} options={{ headerShown: false }} />
            {/* <Stack.Screen name="SelectUser" component={SelectUser} options={{ headerShown: false }} /> */}
            <Stack.Screen name="Payments" component={Payments} options={{ headerShown: false }} />
            <Stack.Screen name="paymentsHistory" component={paymentsHistory} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

export default App;

