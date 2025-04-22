import axiosInstance from "../axiosInstance";

const changeMobileNoApi = {
    addNewNumber: (data) => {
        return axiosInstance.post(`request-mobile-change/`, data);
    } ,
    verifyMobileNo: (data) => {
        return axiosInstance.post(`verify-mobile-change/`,data);
    } ,

};

export default changeMobileNoApi;