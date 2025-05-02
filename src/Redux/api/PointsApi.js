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
    viewTerminalPoints:(id) => {
        console.log('data in api',id); 
        return axiosInstance.get(`api/redeemAwardPoints/terminal-customer-points/?terminal_id=${id}`)
    }
};

export default PointsApi;