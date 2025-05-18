// src/services/authService.js
import axiosInstance from "../config/axiosConfig";
import { ENDPOINTS } from "../config/apiConfig";

const courtService = {
    getById: async (courtId) => {
        try {
            // Sử dụng phương thức GET với endpoint đúng
            const response = await axiosInstance.get(
                `${ENDPOINTS.COURT.GET_BY_ID}/${courtId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching court details:", error);
            if (error.response && error.response.data) {
                throw {
                    response: error.response,
                    message:
                        error.response.data.message ||
                        "Không thể lấy thông tin sân",
                };
            }
            throw error.response ? error.response.data : error.message;
        }
    },

    getFreeHours: async (courtId, startDate, currentTimeStr) => {
        try {
            const response = await axiosInstance.get(
                ENDPOINTS.COURT.GET_BY_FREE_HOURS,
                {
                    params: {
                        courtId,
                        startDate,
                        currentTimeStr,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching court details:", error);
            if (error.response && error.response.data) {
                throw {
                    response: error.response,
                    message:
                        error.response.data.message ||
                        "Không thể lấy thông tin sân",
                };
            }
            throw error.response ? error.response.data : error.message;
        }
    },

    // Trong service
    getList: async (
        pageNumber = 1,
        pageSize = 4,
        sportId,
        status = "Active"
    ) => {
        try {
            const response = await axiosInstance.get(ENDPOINTS.COURT.LIST, {
                params: {
                    sportId,
                    pageNumber,
                    pageSize,
                    status,
                },
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
    },

    handleBooking: async (bookingData) => {
        try {
            const formData = new FormData();

            formData.append("CourtId", Number(bookingData.courtId));
            formData.append("UserId", Number(bookingData.userId));
            formData.append("StartTime", bookingData.startTime);
            formData.append("EndTime", bookingData.endTime);
            formData.append(
                "PaymentMethod",
                bookingData.paymentMethod || "Pending"
            );

            console.log("Sending booking formData with fields:", {
                CourtId: Number(bookingData.courtId),
                UserId: Number(bookingData.userId),
                StartTime: bookingData.startTime,
                EndTime: bookingData.endTime,
                PaymentMethod: bookingData.paymentMethod || "Pending",
            });

            const response = await axiosInstance.post(
                ENDPOINTS.COURT.HANDLE_BOOKING,
                formData
            );

            return response.data;
        } catch (error) {
            console.error("Booking error:", error);
            throw error.response ? error.response.data : error.message;
        }
    },
};

export default courtService;
