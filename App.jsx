import React from 'react';
import './ReactotronConfig'; 
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
if (__DEV__) {
  require("./ReactotronConfig");
}


// Import your screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { Provider } from 'react-redux';
import store from './src/Redux/store';

const Stack = createStackNavigator();

function App() {
  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar
            // barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            // backgroundColor={backgroundStyle.backgroundColor}
          />
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

export default App;