
import axiosInstance from "../axiosInstance";

const userApi = {
    loginUser: (credentials) => {
        return axiosInstance.post(`/`, credentials);
    },
    RegisterUser: (userData) => {
        console.log('userData', userData);
        const requestR = axiosInstance.post('register-user/', userData);
        console.log('requestR', requestR);
        return requestR;
    },  
    verifyOtp: (data) => {
        return axiosInstance.post('verify-otp', data);
    }
};

export default userApi;