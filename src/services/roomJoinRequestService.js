import { ENDPOINTS } from "../config/apiConfig";
import axiosInstance from "../config/axiosConfig";

const roomJoinRequestService = {
    create: async (roomId, requesterId) => {
        try {
            const response = await axiosInstance.post(
                ENDPOINTS.ROOM_JOIN_REQUEST.CREATE_ROOM_JOIN_REQUEST, {
                roomId,
                requesterId
            },
            );

            return response.data;
        } catch (error) {
            console.error("Error create room join request:", error);
            if (error.response && error.response.data) {
                throw {
                    response: error.response,
                    message:
                        error.response.data.message,
                };
            }
            throw error.response ? error.response.data : error.message;
        }
    },
}

export default roomJoinRequestService;