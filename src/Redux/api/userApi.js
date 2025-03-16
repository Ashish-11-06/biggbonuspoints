
import axiosInstance from "../axiosInstance";

const userApi = {
    loginUser: (credentials) => {
        return axiosInstance.post(`/`, credentials);
    },
    RegisterUser: (userData) => {
        return axiosInstance.post('/register-merchant', userData);
    },  
};

export default userApi;