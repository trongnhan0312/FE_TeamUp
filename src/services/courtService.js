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
      throw error.response ? error.response.data : error.message;
    }
  },

  getFreeHours: async (courtId, startDate) => {
    try {
      const response = await axiosInstance.get(
        ENDPOINTS.COURT.GET_BY_FREE_HOURS,
        {
          params: {
            courtId,
            startDate,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // Trong service
  getList: async (
    pageNumber = 1,
    pageSize = 4,
    type,
    sportId,
    status = "Active"
  ) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.COURT.LIST, {
        params: {
          pageNumber,
          pageSize,
          type,
          sportId,
          status,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  handleBooking: async (bookingData) => {
    try {
      const userId = Number(bookingData.userId);
      const courtId = Number(bookingData.courtId);

      if (!userId || isNaN(userId)) {
        throw new Error("UserId không hợp lệ");
      }

      if (!courtId || isNaN(courtId)) {
        throw new Error("CourtId không hợp lệ");
      }

      const formData = new FormData();
      formData.append("CourtId", courtId);
      formData.append("UserId", userId);
      formData.append("StartTime", bookingData.startTime);
      formData.append("EndTime", bookingData.endTime);

      if (bookingData.voucherId != null) {
        formData.append("VoucherId", bookingData.voucherId);
      }

      formData.append("PaymentMethod", bookingData.paymentMethod || "Pending");

      console.log("Sending booking formData with fields:", {
        CourtId: courtId,
        UserId: userId,
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
      console.error("Lỗi khi gửi dữ liệu đặt sân:", error);
      throw error.response ? error.response.data : error.message;
    }
  },
  createCourt: async (formData) => {
    try {
      const response = await axiosInstance.post(
        ENDPOINTS.OWNER.CREATE_COURT,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getLatestBookingId: async (userId) => {
    try {
      const response = await axiosInstance.get(
        ENDPOINTS.COURT_BOOKING.LATEST_BOOKING_ID,
        {
          params: { userId },
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
    courtBookingId,
    coachBookingId = null,
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
};

export default courtService;
