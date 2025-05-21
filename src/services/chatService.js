import { ENDPOINTS } from "../config/apiConfig";
import axiosInstance from "../config/axiosConfig";

const chatService = {
    sendMessage: async (senderId, recipientId, message) => {
        try {
            const response = await axiosInstance.post(ENDPOINTS.CHAT.SEND_MESSAGE, {
                message,
                senderId,
                recipientId
            },
            );

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
    getMessage: async (senderId, receiverId) => {
        try {
            const response = await axiosInstance.get(`${ENDPOINTS.CHAT.GET_MESSAGE}?senderId=${senderId}&receiverId=${receiverId}`);

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

export default chatService;