// src/services/authService.js
import axiosInstance from "../config/axiosConfig";
import { ENDPOINTS } from "../config/apiConfig";

const authService = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosInstance.post(
        ENDPOINTS.AUTH.REGISTER,
        userData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post(
        ENDPOINTS.AUTH.FORGOT_PASSWORD,
        { email }
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.AUTH.REFRESH_TOKEN, {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  verifyOtp: async (email, code) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.AUTH.VERIFY_OTP, {
        email,
        code,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  resendOtp: async (email) => {
    try {
      const response = await axiosInstance.post(
        ENDPOINTS.AUTH.RESEND_OTP,
        null,
        {
          params: { email },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  loginGoogle: async (loginData) => {
    try {
      const response = await axiosInstance.post(
        ENDPOINTS.AUTH.LOGIN_GOOGLE,
        {
          email: loginData.email,
          email_verified: loginData.email_verified,
          family_name: loginData.family_name,
          given_name: loginData.given_name,
          name: loginData.name,
          picture: loginData.picture,
          sub: loginData.sub
        }
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }
};

export default authService;
