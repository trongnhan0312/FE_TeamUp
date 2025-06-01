import { ENDPOINTS } from "../config/apiConfig";
import axiosInstance from "../config/axiosConfig";

const coachBookingService = {
    create: async (coachId, playerId, courtId, slots, paymentMethod, voucherId = null) => {
        try {
            // Tạo request object chỉ với các field bắt buộc
            const requestBody = {
                coachId,
                playerId,
                courtId,
                slots,
                paymentMethod,
            };

            // Chỉ thêm voucherId nếu có giá trị (khác null hoặc undefined)
            if (voucherId != null) {
                requestBody.voucherId = voucherId;
            }

            const response = await axiosInstance.post(
                ENDPOINTS.COACH_BOOKING.CREATE_COACH_BOOKING,
                requestBody
            );

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    getCoachTotalPriceStats: async (coachId) => {
        try {
            const response = await axiosInstance.get(
                `${ENDPOINTS.COACH_BOOKING.GET_COACH_STATS}/${coachId}`
            );

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },
    getPlayerList: async (coachId) => {
        try {
            const response = await axiosInstance.get(
                `${ENDPOINTS.COACH_BOOKING.GET_PLAYER_LIST}/${coachId}`
            );

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },
    getMonthlyTotal: async (coachId) => {
        try {
            const response = await axiosInstance.get(
                `${ENDPOINTS.COACH_BOOKING.GET_MONTHLY_TOTAL}/${coachId}`
            );

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },
    getWeeklyBookedSlots: async (coachId) => {
        try {
            const response = await axiosInstance.get(
                `${ENDPOINTS.COACH_BOOKING.GET_WEEKLY_BOOKED_SLOTS}/${coachId}`
            );

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },
    getAllByCoachId: async (coachId, pageNumber = 1, pageSize = 10) => {
        try {
            const response = await axiosInstance.get(
                ENDPOINTS.COACH_BOOKING.GET_ALL, {
                params: {
                    coachId,
                    pageNumber,
                    pageSize
                },
            });

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },
    getTotalPriceThisMonth: async (coachId, paymentMethod = "PayOS") => {
        try {
            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();

            const response = await axiosInstance.get(
                ENDPOINTS.COACH_BOOKING.GET_TOTAL_PRICE,
                {
                    params: {
                        coachId,
                        paymentMethod,
                        month,
                        year
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },
    getAllByUserId: async (userId, pageNumber = 1, pageSize = 10) => {
        try {
            const response = await axiosInstance.get(
                ENDPOINTS.COACH_BOOKING.GET_ALL,
                {
                    params: {
                        userId,
                        pageNumber,
                        pageSize
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },
    updateStatus: async (id, status) => {
        try {
            const response = await axiosInstance.patch(`${ENDPOINTS.COACH_BOOKING.UPDATE_STATUS}/${id}`,
                null,
                {
                    params: {
                        status
                    }
                })

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    }

}

export default coachBookingService;