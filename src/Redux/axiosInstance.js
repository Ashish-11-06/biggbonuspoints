import { create } from 'apisauce';
import Reactotron from 'reactotron-react-native';

const axiosInstance = create({
  baseURL: 'http://192.168.1.62:8000/api',
  headers: {
    'Content-Type': 'application/json',
},
});

// Add Reactotron monitor
axiosInstance.addMonitor(Reactotron.apisauce);

export default axiosInstance;
