import axiosInstance from "../axiosInstance";

const transferPointsApi = {
    redeemPoints: (transferData) => {
        return axiosInstance.post(`redeemAwardPoints/redeem/`, transferData);
    },
    awardPoints:(transferData) => {
        return axiosInstance.post(`redeemAwardPoints/award/`,transferData)
    },
    customerToCustomer:(transferData) => {
        return axiosInstance.post(`redeemAwardPoints/customer-transfer/`, transferData);
    },
    merchantToMerchant:(transferData) => {
        return axiosInstance.post(`redeemAwardPoints/merchant-transfer/`, transferData);
    },
    terminalToCust:(transferData) => {
        return axiosInstance.post(`redeemAwardPoints/terminal-transfer-points/`,transferData)
    }


};

export default transferPointsApi;