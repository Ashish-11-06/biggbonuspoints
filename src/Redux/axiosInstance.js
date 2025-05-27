import { create } from 'apisauce';
import Reactotron from 'reactotron-react-native';

const axiosInstance = create({
  baseURL: 'https://7d65-2409-40c2-11a1-b030-64f1-3d5d-ad4a-6bac.ngrok-free.app/api',
  headers: {
    'Content-Type': 'application/json',
},
});

// Add Reactotron monitor
axiosInstance.addMonitor(Reactotron.apisauce);

export default axiosInstance;
