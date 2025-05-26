import { ENDPOINTS } from "../config/apiConfig";
import axiosInstance from "../config/axiosConfig";

const roomService = {
    getRooms: async (filters) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ROOM.GET_ALL, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching match list:", error);
      if (error.response && error.response.data) {
        throw {
          response: error.response,
          message:
            error.response.data.message || "Không thể lấy danh sách",
        };
      }
      throw error.response ? error.response.data : error.message;
    }
  },
}

export default roomService;