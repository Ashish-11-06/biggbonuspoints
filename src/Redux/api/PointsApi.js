import axiosInstance from "../axiosInstance";

const PointsApi = {
    viewMerchantWisePoints: (data) => {
        return axiosInstance.post(`redeemAwardPoints/customer/`, data);
    },
    viewCustomerWisePoints : (merchantId) => {
        console.log('data in api request',merchantId);
        return axiosInstance.get(`redeemAwardPoints/merchant/${merchantId}/`);
    } ,
    viewPrepaidMerchants :() => {
        console.log('view prepaid merchants');    
        return axiosInstance.get(`redeemAwardPoints/customer-points/prepaid-merchants/`)
    } ,
    viewTerminalPoints:(id) => {
        console.log('data in api',id); 
        return axiosInstance.get(`redeemAwardPoints/terminal-customer-points/?terminal_id=${id}`)
    },
    viewCustomerGlobalPoints: (data) => {
        console.log('data in api',data); 
        return axiosInstance.post(`redeemAwardPoints/get-GlobalCustomerPoints/`,data)
    },
};

export default PointsApi;