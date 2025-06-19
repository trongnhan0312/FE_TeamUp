// src/services/coachBookingService.js
import { ENDPOINTS } from "../config/apiConfig";
import axiosInstance from "../config/axiosConfig";

const coachBookingService = {
  create: async (bookingRequest) => {
    try {
      const response = await axiosInstance.post(
        ENDPOINTS.COACH_BOOKING.CREATE_COACH_BOOKING,
        bookingRequest
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getTopUsers: async (coachId) => {
    try {
      const response = await axiosInstance.get(
        `${ENDPOINTS.COACH_BOOKING.GET_TOP_USER}/${coachId}`
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
        ENDPOINTS.COACH_BOOKING.GET_ALL,
        {
          params: {
            coachId,
            pageNumber,
            pageSize,
          },
        }
      );

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
            year,
          },
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
            pageSize,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  updateStatus: async (id, status) => {
    try {
      const response = await axiosInstance.patch(
        `${ENDPOINTS.COACH_BOOKING.UPDATE_STATUS}/${id}`,
        null,
        {
          params: {
            status,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getLatestCoachBookingId: async (playerId) => {
    try {
      const response = await axiosInstance.get(
        ENDPOINTS.COACH_BOOKING.GET_LATEST_BOOKING_ID,
        {
          params: { playerId },
        }
      );
      if (response.data.isSuccessed) {
        return response.data.resultObj;
      }
      return null;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  createVnpayUrl: async ({
    userId,
    courtBookingId = null,
    coachBookingId,
    packageId = null,
  }) => {
    try {
      const response = await axiosInstance.post(
        ENDPOINTS.PAYMENT.CREATE_PAYMENT_VNPay,
        {
          userId,
          courtBookingId,
          coachBookingId,
          packageId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.isSuccessed) {
        return response.data.message; // Đây chính là URL VNPay
      }

      return null;
    } catch (error) {
      console.error("Lỗi khi tạo link thanh toán VNPay:", error);
      throw error.response ? error.response.data : error.message;
    }
  },
  // SỬA ĐỔI QUAN TRỌNG TẠI ĐÂY
  getCoachById: async (coachId) => {
    try {
      // Sử dụng GET_COACH_PROFILE hoặc GET_EMPLOYEE_BY_ID tùy theo backend của bạn
      const response = await axiosInstance.get(
        `${ENDPOINTS.EMPLOYEE.GET_COACH_PROFILE}/${coachId}`
      );

      if (response.data.isSuccessed) {
        return response.data.resultObj;
      }

      // Trả về null nếu isSuccessed là false nhưng không có lỗi
      return null;
    } catch (error) {
      // Log lỗi cụ thể hơn
      console.error("Error fetching coach by ID:", error);
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default coachBookingService;
