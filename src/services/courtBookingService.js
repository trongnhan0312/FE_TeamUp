import { ENDPOINTS } from "../config/apiConfig";
import axiosInstance from "../config/axiosConfig";

const courtBookingService = {
  // Lấy danh sách đặt sân theo userId
  getCourtBookingList: async (userId, pageNumber = 1, pageSize = 10) => {
    try {
      const response = await axiosInstance.get(
        ENDPOINTS.COURT_BOOKING.GET_ALL,
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

  // Cập nhật trạng thái đặt sân
  updateStatus: async (id, status) => {
    try {
      const response = await axiosInstance.patch(
        `${ENDPOINTS.COURT_BOOKING.UPDATE_STATUS}/${id}`,
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

  // Lấy chi tiết booking theo ID
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(
        `${ENDPOINTS.COURT_BOOKING.GET_BY_ID}/${id}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default courtBookingService;
