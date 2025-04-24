import axiosInstance from "../axiosInstance";

const helpSectionApi = {
    addHelpDetails: (data) => {
        return axiosInstance.post(`redeemAwardPoints/help/`, data);
    }   
};

export default helpSectionApi;