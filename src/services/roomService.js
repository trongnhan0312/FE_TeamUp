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
      throw error.response ? error.response.data : error.message;
    }
  },
  updateStatus: async (id, status) => {
    try {
      const response = await axiosInstance.patch(`${ENDPOINTS.ROOM.UPDATE_STATUS}/${id}`,
        null,
        {
          params: {
            status
          }
        })

      return response.data;
    } catch (error) {
      console.error("Error fetching courts list:", error);
      throw error.response ? error.response.data : error.message;
    }
  },
  create: async (hostId, courtId, name, maxPlayers, description, roomFee, scheduledTime) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.ROOM.CREATE,
        {
          hostId,
          courtId,
          name,
          maxPlayers,
          description,
          roomFee,
          scheduledTime
        })

      return response.data;
    } catch (error) {
      console.error("Error fetching courts list:", error);
      throw error.response ? error.response.data : error.message;
    }
  },
  getById: async (roomId) => {
    try {
      const response = await axiosInstance.get(`${ENDPOINTS.ROOM.GET_BY_ID}/${roomId}`)

      return response.data;
    } catch (error) {
      console.error("Error fetching courts list:", error);
      throw error.response ? error.response.data : error.message;
    }
  }
}

export default roomService;