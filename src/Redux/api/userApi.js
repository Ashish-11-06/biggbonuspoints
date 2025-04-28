
import axiosInstance from "../axiosInstance";

const userApi = {
    loginUser: (credentials) => {
        console.log('login data appi', credentials);
        
        return axiosInstance.post(`login-user/`, credentials);
    },
    RegisterUser: (userData) => {
        console.log('userData', userData);
        const requestR = axiosInstance.post('register-user/', userData);
        console.log('requestR', requestR);
        return requestR;
    },  
    verifyOtp: (data) => {
        return axiosInstance.post('verify-otp/', data);
    },
    getAllMerchants: () => {
        return axiosInstance.get('fetch-users/?user_type=merchant');
    },
    getAllCustomers: () => {
        return axiosInstance.get('fetch-users/?user_type=customer');
    },

};

export default userApi;