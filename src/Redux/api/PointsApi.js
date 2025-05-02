import axiosInstance from "../axiosInstance";

const PointsApi = {
    viewMerchantWisePoints: (data) => {
        return axiosInstance.post(`redeemAwardPoints/customer/`, data);
    },
    viewCustomerWisePoints : (merchantId) => {
        return axiosInstance.get(`redeemAwardPoints/merchant/${merchantId}/`);
    } ,
    viewPrepaidMerchants :() => {
        console.log('view prepaid merchants');    
        return axiosInstance.get(`redeemAwardPoints/customer-points/prepaid-merchants/`)
    } ,
    viewTerminalPoints:(data) => {
        console.log('data in api',data); 
        return axiosInstance.post(`redeemAwardPoints/terminal-customer-points/`,data)
    }
};

export default PointsApi;