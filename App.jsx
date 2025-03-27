import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

// Import your screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CustomerSelection from './src/screens/CustomerSelection'
import { Provider } from 'react-redux';
import store from './src/Redux/store';
import ScanQR from './src/screens/ScanQR';
import PointsScreen from './src/screens/PointsScreen';
import ShowPoints from './src/screens/ShowPoints';
import Awards from './src/screens/Awards';
import MerchantForm from './src/screens/MerchantForm';

const Stack = createStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <Provider store={store}>
       <PaperProvider>
    <NavigationContainer>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Stack.Navigator initialRouteName="Login">
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
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
    </Provider>
  );
}

export default App;