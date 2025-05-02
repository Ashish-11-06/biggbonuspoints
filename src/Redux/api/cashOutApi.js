import axiosInstance from "../axiosInstance";

const cashOutApi = {
    addCashoutCustomer: (data) => {
        return axiosInstance.post(`redeemAwardPoints/customer/cashout/`, data);
    } , 
    addCashoutMerchant: (data) => {
        return axiosInstance.post(`redeemAwardPoints/api/merchant/cashout/`, data);
    } , 

};

export default cashOutApi;