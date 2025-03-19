import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '192.168.1.49:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
