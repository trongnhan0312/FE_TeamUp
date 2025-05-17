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
            console.error("Error fetching sport details:", error);
            if (error.response && error.response.data) {
                throw {
                    response: error.response,
                    message:
                        error.response.data.message ||
                        "Không thể lấy thông tin sân",
                };
            }
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
            console.error("Error fetching sports list:", error);
            if (error.response && error.response.data) {
                throw {
                    response: error.response,
                    message:
                        error.response.data.message ||
                        "Không thể lấy danh sách sân",
                };
            }
            throw error.response ? error.response.data : error.message;
        }
    },
};

export default sportService;
