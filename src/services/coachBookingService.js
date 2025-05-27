import { ENDPOINTS } from "../config/apiConfig";
import axiosInstance from "../config/axiosConfig";

const coachBookingService = {
    create: async (coachId, playerId, courtId, slots, paymentMethod, voucherId = null) => {
        try {
            const response = await axiosInstance.post(
                ENDPOINTS.COACH_BOOKING.CREATE_COACH_BOOKING, {
                coachId,
                playerId,
                courtId,
                slots,
                paymentMethod,
                voucherId
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

export default coachBookingService;