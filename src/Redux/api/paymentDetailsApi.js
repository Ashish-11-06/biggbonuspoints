import axiosInstance from "../axiosInstance";

const paymentDetailsApi = {
    paymentDetails: (data) => {
        console.log('data in api',data);   
        return axiosInstance.post(`redeemAwardPoints/payment-details/`, data);
    } ,
   getPaymentDetails : (user_id) => {
    return axiosInstance.get(`redeemAwardPoints/payment-details/${user_id}`);

   }
};

export default paymentDetailsApi;