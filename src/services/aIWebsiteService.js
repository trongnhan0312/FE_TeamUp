import { ENDPOINTS } from "../config/apiConfig";
import axiosInstance from "../config/axiosConfig";

const aIWebsiteService = {
    getResponse: async (question) => {
        try {
            const response = await axiosInstance.get(ENDPOINTS.AI_WEBSITE.GET_RESPONSE, {
                params: {
                    question
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

export default aIWebsiteService;