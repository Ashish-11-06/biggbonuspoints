import axiosInstance from "../axiosInstance";

const PointsApi = {
    viewMerchantWisePoints: (data) => {
        return axiosInstance.post(`redeemAwardPoints/customer/`, data);
    }   
};

export default PointsApi;