import { create } from 'apisauce';
import Reactotron from 'reactotron-react-native';

const axiosInstance = create({
  baseURL: 'http://192.168.1.60:8000/transfer/',
  headers: {
    'Content-Type': 'application/json',
},
});

// Add Reactotron monitor
axiosInstance.addMonitor(Reactotron.apisauce);

export default axiosInstance;
