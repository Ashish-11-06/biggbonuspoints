import axiosInstance from "../axiosInstance";

const additinalDetailsApi = {
    addAdditinalDetails: ({userId,data}) => {
        return axiosInstance.put(`redeemAwardPoints/update-customer-profile/${userId}/`,data);
    }  , 
    getAdditionalDetails: (userId) => {
        return axiosInstance.get(`redeemAwardPoints/customer/profile/${userId}/`);
    },
    addAdditinalDetailsMerchant: ({userId,data}) => {
        return axiosInstance.put(`redeemAwardPoints/update-merchant-profile/${userId}/`,data);
    },
    getAdditionalDetailsMerchant: (userId) => {
        console.log('heloo');
        console.log('userId in api',userId);
        
        return axiosInstance.get(`redeemAwardPoints/merchant/profile/${userId}/`);
    },
};

export default additinalDetailsApi;