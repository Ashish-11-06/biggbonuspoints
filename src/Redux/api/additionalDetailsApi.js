import axiosInstance from "../axiosInstance";

const additinalDetailsApi = {
    addAdditinalDetails: ({userId,data}) => {
        return axiosInstance.put(`redeemAwardPoints/update-customer-profile/${userId}/`,data);
    }  , 
    getAdditionalDetails: (userId) => {
        return axiosInstance.get(`redeemAwardPoints/customer/profile/${userId}/`);
    },
};

export default additinalDetailsApi;