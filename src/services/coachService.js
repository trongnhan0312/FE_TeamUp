// src/services/coachService.js
import axiosInstance from "../config/axiosConfig";
import { ENDPOINTS } from "../config/apiConfig";

const coachService = {
  // Phương thức gọi API lấy danh sách huấn luyện viên theo phân trang
  getCoachesPagination: async (searchValue, pageIndex, pageSize) => {
    try {
      const response = await axiosInstance.post(
        ENDPOINTS.EMPLOYEE.GET_COACHES_PAGINATION,
        {
          searchValue,
          pageIndex,
          pageSize,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // Phương thức lấy chi tiết huấn luyện viên
  getCoachProfile: async (coachId) => {
    try {
      const response = await axiosInstance.get(
        `${ENDPOINTS.EMPLOYEE.GET_COACH_PROFILE}/${coachId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getCoachRatings: async (revieweeId, pageNumber = 1, pageSize = 5) => {
    try {
      const response = await axiosInstance.get(
        `${ENDPOINTS.RATING.LIST}?revieweeId=${revieweeId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      console.log("Response from getCoachRatings:", response.data);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  updateCoachProfile: async (data) => {
    /**
     * data là object có các key tương ứng với các trường API PUT nhận
     * Ví dụ:
     * {
     *   PricePerSession: '500000',
     *   WorkingAddress: 'Hà Nội',
     *   Height: '175',
     *   Experience: '5 năm',
     *   TargetObject: 'Người mới tập',
     *   AvatarUrl: File | String,
     *   Certificate: File | String,
     *   PhoneNumber: '0987654321',
     *   Weight: '70',
     *   FullName: 'Nguyễn Văn A',
     *   Type: 'Coach',
     *   Id: '123',
     *   Specialty: 'Yoga',
     *   Age: '30',
     *   WorkingDate: '2023-01-01'
     * }
     */

    try {
      const formData = new FormData();

      // Thêm các trường vào formData, nếu value khác null/undefined
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await axiosInstance.put(
        ENDPOINTS.EMPLOYEE.UPDATE_COACH_PROFILE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default coachService;
