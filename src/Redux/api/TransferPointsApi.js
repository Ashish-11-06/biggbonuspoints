import axiosInstance from "../axiosInstance";

const transferPointsApi = {
    redeemPoints: (transferData) => {
        return axiosInstance.post(`redeemAwardPoints/redeem/`, transferData);
    }   
};

export default transferPointsApi;