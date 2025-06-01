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
            throw error.response ? error.response.data : error.message;
        }
    },
    getAll: async (roomId, status = "Pending", pageNumber = 1, pageSize = 5) => {
        try {
            const response = await axiosInstance.get(ENDPOINTS.ROOM_JOIN_REQUEST.GET_ALL, {
                params: {
                    pageNumber,
                    pageSize,
                    status,
                    roomId
                },
            });

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },
    updateStatus: async (requestId, status) => {
        try {
            const response = await axiosInstance.patch(`${ENDPOINTS.ROOM_JOIN_REQUEST.UPDATE_STATUS}/${requestId}`,
                null,
                {
                    params: {
                        status
                    }
                });

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    }
}

export default roomJoinRequestService;