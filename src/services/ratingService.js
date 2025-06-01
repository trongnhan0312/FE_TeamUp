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
  create: async (reviewerId, revieweeId, ratingValue, comment = null) => {
    try {
      const formData = new FormData();

      formData.append("ReviewerId", Number(reviewerId));
      formData.append("RevieweeId", Number(revieweeId));
      formData.append("RatingValue", Number(ratingValue));
      if (comment !== null) {
        formData.append("Comment", comment);
      }

      const response = await axiosInstance.post(ENDPOINTS.RATING.CREATE, formData);

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getValueRating: async (reviewerId, revieweeId) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.RATING.LIST, { params: { reviewerId, revieweeId } });

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }
};

export default ratingService;
