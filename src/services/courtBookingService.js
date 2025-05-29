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
            throw error.response ? error.response.data : error.message;
        }
    },
    // status: "Pending" | "Confirmed" | "InProgress" | "Completed" | "CancelledByUser" | "CancelledByOwner" | "NoShow" | "Failed" | "CancelledByCoach"
    updateStatus: async (id, status) => {
        try {
            const response = await axiosInstance.patch(`${ENDPOINTS.COURT_BOOKING.UPDATE_STATUS}/${id}`,
                null,
                {
                    params: {
                        status
                    }
                })

            return response.data;
        } catch (error) {
            console.error("Error fetching courts list:", error);
            throw error.response ? error.response.data : error.message;
        }
    }
}

export default courtBookingService;