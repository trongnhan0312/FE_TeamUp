// src/services/authService.js
import axiosInstance from "../config/axiosConfig";
import { ENDPOINTS } from "../config/apiConfig";

const ratingService = {
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
          message: error.response.data.message || "Không thể lấy thông tin sân",
        };
      }
      throw error.response ? error.response.data : error.message;
    }
  },

  // Trong service
  getList: async (pageNumber = 1, pageSize = 4, revieweeId) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.RATING.LIST, {
        params: {
          pageNumber,
          pageSize,
          revieweeId,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching ratings list:", error);
      if (error.response && error.response.data) {
        throw {
          response: error.response,
          message: error.response.data.message || "Không thể lấy danh đánh giá",
        };
      }
      throw error.response ? error.response.data : error.message;
    }
  },
  getAverageCount: async (revieweeId) => {
    try {
      const response = await axiosInstance.get(
        `${ENDPOINTS.RATING.AVERAGE}${revieweeId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching average and count:", error);
      if (error.response && error.response.data) {
        return {
          isSuccessed: false,
          message:
            error.response.data.message || "Lỗi khi lấy dữ liệu đánh giá",
          resultObj: null,
        };
      }
      return {
        isSuccessed: false,
        message: error.message || "Lỗi khi lấy dữ liệu đánh giá",
        resultObj: null,
      };
    }
  },
};

export default ratingService;
