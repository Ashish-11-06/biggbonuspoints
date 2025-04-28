import axiosInstance from "../axiosInstance";

const PointsApi = {
    viewMerchantWisePoints: (data) => {
        return axiosInstance.post(`redeemAwardPoints/customer/`, data);
    },
    viewCustomerWisePoints : (data) => {
        return axiosInstance.post(`redeemAwardPoints/merchant/`,data);
    }  
};

export default PointsApi;