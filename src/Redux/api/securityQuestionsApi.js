import axiosInstance2 from "../axiosInstance";

const securityQuestionsApi = {
    securityQuestions: (id) => {
        return axiosInstance2.get(`redeemAwardPoints/get-sequerity-ques/`);
    }   
};

export default securityQuestionsApi;