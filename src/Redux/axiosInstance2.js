import { create } from 'apisauce';
import Reactotron from 'reactotron-react-native';

const axiosInstance = create({
  baseURL: 'https://4ac1-103-211-60-165.ngrok-free.app/transfer/',
  headers: {
    'Content-Type': 'application/json',
},
});

// Add Reactotron monitor
axiosInstance.addMonitor(Reactotron.apisauce);

export default axiosInstance;
