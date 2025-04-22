import axiosInstance2 from "../axiosInstance";

const transactionHistoryApi = {
    transactionHistory: ({user_id,user_category}) => {
        console.log("user",user_id);
        console.log("user_category",user_category);   
        return axiosInstance2.get(`redeemAwardPoints/transaction-history/${user_id}/${user_category}`);
    }   
};

export default transactionHistoryApi;