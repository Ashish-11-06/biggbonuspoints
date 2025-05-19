import axiosInstance from "../axiosInstance";

const changePinApi = {
    changePin: (data) => {
        console.log('data in api:',data);
        return axiosInstance.post(`request-pin-change/`, data);
    } ,
    verifyPinOtp: (data) => {
        return axiosInstance.post(`verify-pin-otp/`,data);
    } ,
    verifyPinSecurity: (data) => {
        return axiosInstance.post(`verify-pin-security/`,data);
    } ,

};

export default changePinApi;