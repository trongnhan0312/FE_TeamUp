/**
 * Chuyển đối tượng Date thành chuỗi định dạng yyyy-MM-dd để gửi lên API.
 *
 * @param date - Đối tượng Date cần định dạng.
 * @returns Chuỗi định dạng yyyy-MM-dd hoặc null nếu không có date.
 */
export const formatDateForAPI = (date) => {
  if (!date) return null;
  return date.toISOString().split("T")[0];
};

/**
 * Định dạng chuỗi ISO datetime thành định dạng ngày giờ theo chuẩn vi-VN.
 *
 * @param isoString - Chuỗi ISO datetime (VD: "2023-05-26T12:30:00Z").
 * @returns Chuỗi ngày giờ định dạng vi-VN hoặc chuỗi rỗng nếu dữ liệu không hợp lệ.
 */
export const formatDateTime = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

/**
 * Chuyển tổng số phút thành chuỗi thời gian có định dạng hh:mm.
 *
 * @param minutes - Tổng số phút cần chuyển đổi.
 * @returns Chuỗi thời gian định dạng hh:mm (VD: "01:45").
 */
export const minutesToTime = (minutes) => {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
};

/**
 * Chuyển chuỗi thời gian định dạng hh:mm thành tổng số phút.
 *
 * @param timeStr - Chuỗi thời gian định dạng hh:mm (VD: "02:30").
 * @returns Tổng số phút tương ứng với chuỗi thời gian.
 */
export const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};
