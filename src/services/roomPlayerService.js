import { ENDPOINTS } from "../config/apiConfig";
import axiosInstance from "../config/axiosConfig";

const roomPlayerService = {
    getAllByRoomId: async (roomId, pageNumber = 1, pageSize = 5) => {
        try {
            const response = await axiosInstance.get(ENDPOINTS.ROOM_PLAYER.GET_ALL, {
                params: {
                    roomId, 
                    pageNumber,
                    pageSize
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching match list:", error);
            throw error.response ? error.response.data : error.message;
        }
    }
}

export default roomPlayerService;