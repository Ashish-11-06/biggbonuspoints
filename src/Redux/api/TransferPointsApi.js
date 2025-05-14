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
    customerToGlobal:(transferData) => {
        return axiosInstance.post(`redeemAwardPoints/global-redeem/`, transferData);
    },

    merchantToMerchant:(transferData) => {
        return axiosInstance.post(`redeemAwardPoints/merchant-transfer/`, transferData);
    },
    terminalToCust:(transferData) => {
        return axiosInstance.post(`redeemAwardPoints/terminal-transfer-points/`,transferData)
    },
    customerToCorporate:(transferData) => {
        return axiosInstance.post(`redeemAwardPoints/corporate/redeem/`, transferData);
    }
};

export default transferPointsApi;