// src/services/coachService.js
import axiosInstance from "../config/axiosConfig";
import { ENDPOINTS } from "../config/apiConfig";

const coachService = {
    // Phương thức gọi API lấy danh sách huấn luyện viên theo phân trang
    getCoachesPagination: async (searchValue, pageIndex, pageSize) => {
        try {
            const response = await axiosInstance.post(
                ENDPOINTS.EMPLOYEE.GET_COACHES_PAGINATION,
                {
                    searchValue,
                    pageIndex,
                    pageSize,
                }
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw {
                    response: error.response,
                    message:
                        error.response.data.message ||
                        "Không thể lấy danh sách huấn luyện viên",
                };
            }
            throw error.response ? error.response.data : error.message;
        }
    },

    // Phương thức lấy chi tiết huấn luyện viên
    getCoachProfile: async (coachId) => {
        try {
            const response = await axiosInstance.get(
                `${ENDPOINTS.EMPLOYEE.GET_COACH_PROFILE}/${coachId}`
            );
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },
};

export default coachService;
