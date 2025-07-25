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

  updateUserOwnerProfile: async (formDataObject) => {
    try {
      const formData = new FormData();
      for (const key in formDataObject) {
        formData.append(key, formDataObject[key]);
      }

      const response = await axiosInstance.put(
        ENDPOINTS.USER.UPDATE_USER_OWNER_PROFILE,
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

  updateProfile: async (
    id,
    fullName = null,
    phoneNumber = null,
    age = null,
    height = null,
    weight = null,
    avatarUrl = null
  ) => {
    try {
      const payload = {
        Id: Number(id),
      };

      if (fullName) payload.FullName = fullName;
      if (phoneNumber) payload.PhoneNumber = phoneNumber;
      if (age != null) payload.Age = age;
      if (height != null) payload.Height = height;
      if (weight != null) payload.Weight = weight;
      if (avatarUrl) payload.AvatarUrl = avatarUrl;

      const response = await axiosInstance.put(
        ENDPOINTS.USER.UPDATE_PROFILE,
        payload
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getUserByRole: async (userId, role) => {
    try {
      const endpoint =
        role === "User"
          ? ENDPOINTS.USER.GET_USER_BY_ID
          : ENDPOINTS.EMPLOYEE.GET_COACH_PROFILE;

      const response = await axiosInstance.get(`${endpoint}/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default userService;
