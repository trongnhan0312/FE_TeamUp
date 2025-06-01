import { ENDPOINTS } from "../config/apiConfig";
import axiosInstance from "../config/axiosConfig";

const voucherService = {
    getVouchers: async (pageNumber = 1, pageSize = 10) => {
        try {
            const response = await axiosInstance.get(ENDPOINTS.VOUCHER.GET_ALL, {
                params: { pageNumber, pageSize },
            });

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },
    getVoucherById: async (voucherId) => {
        try {
            const response = await axiosInstance.get(`${ENDPOINTS.VOUCHER.GET_BY_ID}/${voucherId}`);

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    }
}

export default voucherService;