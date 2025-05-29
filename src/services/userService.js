import axiosInstance from "../config/axiosConfig";
import { ENDPOINTS } from "../config/apiConfig";

const userService = {
  getUserById: async (userId) => {
    try {
      const response = await axiosInstance.get(
        `${ENDPOINTS.USER.GET_USER_BY_ID}/${userId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.USER.GET_ALL_USER);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default userService;
