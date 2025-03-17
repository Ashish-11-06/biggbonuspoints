/**
 * @format
 */
import 'react-native-gesture-handler';
import React, { StrictMode } from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

const RootComponent = () => (
  <StrictMode>
    <App />
  </StrictMode>
);

AppRegistry.registerComponent(appName, () => RootComponent);
