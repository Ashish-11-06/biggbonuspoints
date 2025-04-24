import axiosInstance2 from "../axiosInstance";

const customerpointsApi = {
    customerPoints: (id) => {
        return axiosInstance2.get(`customer-points/${id}/`);
    }   
};

export default customerpointsApi;