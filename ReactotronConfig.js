// ReactotronConfig.js
import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import apisaucePlugin from 'reactotron-apisauce';

Reactotron
  .configure() // Configures connection (default: localhost)
  .useReactNative() // Adds React Native integration
  .use(reactotronRedux()) // Adds Redux integration
  .use(apisaucePlugin()) // Adds API monitoring
  .connect(); // Connects to Reactotron desktop app

export default Reactotron;