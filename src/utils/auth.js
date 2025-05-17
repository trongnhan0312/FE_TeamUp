import { jwtDecode } from "jwt-decode";
// Constants
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_INFO_KEY = "user_info";

/**
 * Lưu token vào localStorage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Lấy token từ localStorage
 * @returns {string|null} JWT token hoặc null nếu không có
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Xóa token từ localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Lưu refresh token vào localStorage
 * @param {string} refreshToken - Refresh token
 */
export const setRefreshToken = (refreshToken) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * Lấy refresh token từ localStorage
 * @returns {string|null} Refresh token hoặc null nếu không có
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Xóa refresh token từ localStorage
 */
export const removeRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Lưu thông tin người dùng vào localStorage
 * @param {Object} userInfo - Thông tin người dùng
 */
export const setUserInfo = (userInfo) => {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
};

/**
 * Lấy thông tin người dùng từ localStorage
 * @returns {Object|null} Thông tin người dùng hoặc null nếu không có
 */
export const getUserInfo = () => {
  const userInfo = localStorage.getItem(USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * Xóa thông tin người dùng từ localStorage
 */
export const removeUserInfo = () => {
  localStorage.removeItem(USER_INFO_KEY);
};

/**
 * Kiểm tra xem token hiện tại có hợp lệ không (chưa hết hạn)
 * @returns {boolean} true nếu token hợp lệ, false nếu không
 */
export const isTokenValid = () => {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Chuyển đổi sang giây

    // JWT thường có trường exp (thời gian hết hạn) được tính bằng giây
    if (!decodedToken.exp) {
      return false;
    }

    // Kiểm tra xem token đã hết hạn chưa
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};

/**
 * Giải mã token để lấy thông tin
 * @param {string} token - JWT token cần giải mã
 * @returns {Object|null} Thông tin đã giải mã hoặc null nếu có lỗi
 */
export const decodeToken = (token) => {
  if (!token || typeof token !== "string") {
    console.error("Invalid token specified: must be a string");
    return null;
  }

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Lưu toàn bộ thông tin xác thực (token, refresh token, thông tin người dùng)
 * @param {Object} authData - Dữ liệu xác thực từ API
 * @returns {Object} Thông tin người dùng đã giải mã
 */
export const saveAuthData = (authData) => {
  if (!authData || !authData.resultObj || !authData.resultObj.accessToken) {
    console.error("Invalid auth data. Missing token.");
    return null;
  }

  const { accessToken, refreshToken, id, email, fullName, role } =
    authData.resultObj;

  // Lưu token
  setToken(accessToken);

  // Lưu refresh token nếu có
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }

  try {
    // Giải mã token để lấy thông tin người dùng
    const decodedToken = decodeToken(accessToken);

    const userData = {
      id,
      email,
      fullName,
      role,
      // Bạn có thể thêm thông tin khác từ resultObj hoặc decodedToken
      ...(decodedToken || {}),
    };

    // Lưu thông tin người dùng
    setUserInfo(userData);

    return userData;
  } catch (error) {
    console.error("Error processing auth data:", error);
    // Xóa token nếu có lỗi xảy ra
    removeToken();
    removeRefreshToken();
    return null;
  }
};

/**
 * Xóa toàn bộ thông tin xác thực khi đăng xuất
 */
export const logout = () => {
  removeToken();
  removeRefreshToken();
  removeUserInfo();
};

/**
 * Kiểm tra xem người dùng đã đăng nhập hay chưa
 * @returns {boolean} true nếu đã đăng nhập, false nếu chưa
 */
export const isAuthenticated = () => {
  return isTokenValid() && getUserInfo() !== null;
};

/**
 * Lấy tên người dùng từ thông tin đã lưu
 * @returns {string} Tên người dùng hoặc chuỗi rỗng nếu không có
 */
export const getUserName = () => {
  const userInfo = getUserInfo();
  return userInfo ? userInfo.name || userInfo.username || "" : "";
};

/**
 * Lấy vai trò của người dùng từ thông tin đã lưu
 * @returns {Array} Mảng các vai trò hoặc mảng rỗng nếu không có
 */
export const getUserRoles = () => {
  const userInfo = getUserInfo();
  if (!userInfo) return [];
  // Nếu có trường roles (mảng) thì dùng, còn không thì lấy role (chuỗi)
  if (userInfo.roles && Array.isArray(userInfo.roles)) {
    return userInfo.roles;
  } else if (userInfo.role) {
    return [userInfo.role]; // chuyển chuỗi role thành mảng 1 phần tử
  }
  return [];
};

/**
 * Kiểm tra xem người dùng có vai trò cụ thể không
 * @param {string} role - Vai trò cần kiểm tra
 * @returns {boolean} true nếu có vai trò, false nếu không
 */
export const hasRole = (role) => {
  const roles = getUserRoles();
  return roles.includes(role);
};
