import axiosInstance from "../config/axiosConfig";
import { getApiUrl } from "../config/apiConfig";

const BASE_URL = "https://miraculous-clarity-production.up.railway.app";

const paymentService = {
  getAllPayments: async ({ userId = null, pageNumber = 1, pageSize = 5 }) => {
    try {
      let url = `${BASE_URL}/api/payment/all?pageNumber=${pageNumber}&pageSize=${pageSize}`;
      if (userId !== null) {
        url += `&userId=${userId}`;
      }

      const response = await axiosInstance.get(url, {
        headers: {
          Accept: "application/json", // hoặc 'text/plain' nếu backend yêu cầu
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error.response?.data || error;
    }
  },
};

export default paymentService;
