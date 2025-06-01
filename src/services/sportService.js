// src/services/authService.js
import axiosInstance from "../config/axiosConfig";
import { ENDPOINTS } from "../config/apiConfig";

const sportService = {
    getById: async (sportId) => {
        try {
            // Sử dụng phương thức GET với endpoint đúng
            const response = await axiosInstance.get(
                `${ENDPOINTS.SPORT.GET_BY_ID}/${sportId}`
            );
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Lấy danh sách sân
    getList: async (page = 1, pageSize = 10) => {
        try {
            const response = await axiosInstance.get(ENDPOINTS.SPORT.LIST, {
                params: { page, pageSize },
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },
};

export default sportService;
