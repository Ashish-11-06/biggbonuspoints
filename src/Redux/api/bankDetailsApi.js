import axiosInstance from "../axiosInstance";

const bankDetailsApi = {
    getBankDetails: ({user_id,user_category,data}) => {
        return axiosInstance.post(`redeemAwardPoints/bank-details/${user_id}/${user_category}/`, data);
    } ,
    getBankDetailsById: ({user_id,user_category}) => {
        return axiosInstance.get(`redeemAwardPoints/bank-details/${user_id}/${user_category}/`);
    } ,

};

export default bankDetailsApi;