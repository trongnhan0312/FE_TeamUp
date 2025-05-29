import { ENDPOINTS } from "../config/apiConfig";
import axiosInstance from "../config/axiosConfig";

const courtBookingService = {
    getCourtBookingList: async (userId, pageNumber = 1, pageSize = 10) => {
        try {
            const response = await axiosInstance.get(ENDPOINTS.COURT_BOOKING.GET_ALL, {
                params: {
                    userId,
                    pageNumber,
                    pageSize
                }
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
    }
}

export default courtBookingService;