export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // Trả về true nếu có token, false nếu không
};