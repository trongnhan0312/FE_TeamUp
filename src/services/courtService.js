// src/services/authService.js
import axiosInstance from "../config/axiosConfig";
import { ENDPOINTS } from "../config/apiConfig";

const courtService = {
    getById: async (courtId) => {
        try {
            // Sử dụng phương thức GET với endpoint đúng
            const response = await axiosInstance.get(
                `${ENDPOINTS.COURT.GET_BY_ID}/${courtId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching court details:", error);
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

    // Trong service
    getList: async (
        pageNumber = 1,
        pageSize = 4,
        sportId,
        status = "Active"
    ) => {
        try {
            const response = await axiosInstance.get(ENDPOINTS.COURT.LIST, {
                params: {
                    sportId,
                    pageNumber,
                    pageSize,
                    status,
                },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching courts list:", error);
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

export default courtService;
