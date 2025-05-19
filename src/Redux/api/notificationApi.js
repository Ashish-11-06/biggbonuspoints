import axiosInstance2 from "../axiosInstance";

const notificationApi = {
    notification: ({user_id,user_category}) => {
        console.log("user",user_id);
        console.log("user_category",user_category);   
        return axiosInstance2.get(`redeemAwardPoints/notifications/?${user_category}=${user_id}/`);
    }   
};

export default notificationApi;