import axiosInstance from "../config/axiosConfig";
import { getApiUrl, ENDPOINTS } from "../config/apiConfig";

// Lấy thống kê tổng quan chủ sân
export const fetchOwnerStats = async (ownerId) => {
  try {
    const url = getApiUrl(`${ENDPOINTS.OWNER.OWNER_STATS}?ownerId=${ownerId}`);
    console.log("Calling Owner Stats API: ", url);
    const response = await axiosInstance.get(url);
    if (response.data.isSuccessed) {
      return response.data.resultObj;
    }
    return null;
  } catch (error) {
    console.error("Lỗi khi lấy thống kê owner:", error);
    throw error;
  }
};

// Lấy danh sách slot đã đặt trong tuần cho courtId
export const fetchWeeklyBookedSlots = async (courtId) => {
  try {
    const url = getApiUrl(`${ENDPOINTS.OWNER.WEEKBOOKED_SLOTS}/${courtId}`);
    const response = await axiosInstance.get(url);
    if (response.data.isSuccessed) {
      const slots = response.data.resultObj;
      console.log(`Slots for courtId ${courtId}:`, slots); // debug
      // Đếm số booking cho courtId đó
      return slots.length; // trả về tổng số đơn đặt cho court này
    }
    return 0;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu đặt slot tuần:", error);
    throw error;
  }
};

// --- Hàm mới lấy danh sách sân theo OwnerID ---
export const fetchOwnerCourts = async (
  ownerId,
  pageNumber = 1,
  pageSize = 10
) => {
  try {
    const url = getApiUrl(
      `${ENDPOINTS.OWNER.COURTS}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    console.log("Calling Courts API: ", url);
    const response = await axiosInstance.get(url);

    if (response.data.isSuccessed && response.data.resultObj?.items) {
      // Lọc các sân thuộc ownerId
      const ownerCourts = response.data.resultObj.items.filter(
        (court) =>
          court.sportsComplexModelView?.owner?.id?.toString() ===
          ownerId.toString()
      );
      console.log(
        `Tổng số sân lấy được cho ownerId=${ownerId}:`,
        ownerCourts.length
      );
      return ownerCourts;
    }

    console.log("Không lấy được sân nào");
    return [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sân của Owner:", error);
    throw error;
  }
};
export const fetchAllOwnerCourts = async (ownerId) => {
  const allCourts = [];
  let currentPage = 1;
  let totalPages = 1;

  try {
    do {
      const url = getApiUrl(
        `${ENDPOINTS.OWNER.COURTS}?pageNumber=${currentPage}&pageSize=50`
      );
      console.log(`Gọi API trang ${currentPage}: ${url}`);
      const response = await axiosInstance.get(url);

      if (response.data.isSuccessed && response.data.resultObj?.items) {
        allCourts.push(...response.data.resultObj.items);
        totalPages = response.data.resultObj.totalPages;
        currentPage++;
      } else {
        break;
      }
    } while (currentPage <= totalPages);

    // Lọc sân của owner
    const ownerCourts = allCourts.filter(
      (court) =>
        court.sportsComplexModelView?.owner?.id?.toString() ===
        ownerId.toString()
    );

    console.log(`Tổng số sân của ownerId=${ownerId} là: ${ownerCourts.length}`);

    return ownerCourts;
  } catch (error) {
    console.error("Lỗi khi lấy toàn bộ sân:", error);
    throw error;
  }
};

export const fetchOwnerCourtsWithBookings = async (ownerId) => {
  const allOwnerCourts = await fetchAllOwnerCourts(ownerId);

  const courtsWithBookingCount = await Promise.all(
    allOwnerCourts.map(async (court) => {
      const count = await fetchWeeklyBookedSlots(court.id);
      return {
        ...court,
        weeklyBookingCount: count,
      };
    })
  );

  // Lọc sân có booking > 0 nếu bạn muốn
  return courtsWithBookingCount.filter((court) => court.weeklyBookingCount > 0);
};

export const fetchMostBookedCourtByOwner = async (ownerId) => {
  try {
    const url = getApiUrl(
      `${ENDPOINTS.OWNER.MOST_BOOKED_COURTS}?ownerId=${ownerId}`
    );
    console.log("Calling Most Booked Court API: ", url);
    const response = await axiosInstance.get(url);
    if (response.data.isSuccessed) {
      console.log("Most booked court response:", response.data);
      return response.data.resultObj; // trả về { court, bookingCount }
    }
    return null;
  } catch (error) {
    console.error("Lỗi khi lấy sân đặt nhiều nhất:", error);
    throw error;
  }
};

export const fetchBookingHistory = async (
  ownerId,
  pageNumber = 1,
  pageSize = 5
) => {
  try {
    const url = getApiUrl(
      `${ENDPOINTS.OWNER.BOOKING_HISTORY}?ownerId=${ownerId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    console.log("Calling Booking History API: ", url);
    const response = await axiosInstance.get(url);
    if (response.data.isSuccessed) {
      return response.data.resultObj.items;
    }
    return [];
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử đặt sân:", error);
    throw error;
  }
};

export const fetchBookingWithPrice = async (
  ownerId,
  pageNumber = 1,
  pageSize = 10
) => {
  try {
    // Lấy danh sách sân của owner (giá tiền)
    const courts = await fetchAllOwnerCourts(ownerId);
    // Map courtId => pricePerHour
    const courtPriceMap = {};
    courts.forEach((court) => {
      courtPriceMap[court.id] = court.pricePerHour;
    });

    // Lấy lịch sử booking
    const url = getApiUrl(
      `${ENDPOINTS.OWNER.BOOKING_HISTORY}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    const response = await axiosInstance.get(url);
    if (response.data.isSuccessed) {
      const bookings = response.data.resultObj.items;

      // Gán thêm giá tiền sân vào mỗi booking dựa trên courtId
      const bookingsWithPrice = bookings.map((booking) => {
        const courtId = booking.court?.id;
        return {
          ...booking,
          pricePerHour: courtPriceMap[courtId] || 0,
        };
      });

      return bookingsWithPrice;
    }
    return [];
  } catch (error) {
    console.error("Lỗi khi lấy booking kèm giá sân:", error);
    throw error;
  }
};

export const fetchBookedSlotsWithCourtInfoFromOwner = async (
  ownerId,
  courtId
) => {
  try {
    const allCourts = await fetchAllOwnerCourts(ownerId);
    const courtDetail = allCourts.find((court) => court.id === courtId);
    if (!courtDetail) {
      console.warn(
        `Không tìm thấy sân với courtId=${courtId} trong ownerId=${ownerId}`
      );
      return null;
    }

    const bookedSlots = await fetchWeeklyBookedSlots(courtId);

    return {
      courtId,
      courtName: courtDetail.name || "Không rõ tên sân",
      pricePerHour: courtDetail.pricePerHour || 0,
      bookedSlots,
    };
  } catch (error) {
    console.error("Lỗi khi lấy thông tin sân và booking:", error);
    throw error;
  }
};

export const updateBooking = async (bookingId, status) => {
  try {
    const formData = new FormData();
    formData.append("Status", status);

    const url = `${ENDPOINTS.OWNER.BOOKING_UPDATE}/${bookingId}?status=${status}`;
    const response = await axiosInstance.patch(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.isSuccessed) return response.data.resultObj;

    throw new Error(response.data.message || "Update thất bại");
  } catch (error) {
    console.error("Lỗi cập nhật booking:", error);
    throw error;
  }
};

// Hàm lấy tất cả khu thể thao (sports complexes) theo ownerId
export const fetchSportsComplexesByOwner = async (
  ownerId,
  pageNumber = 1,
  pageSize = 10
) => {
  try {
    const url = getApiUrl(
      `${ENDPOINTS.OWNER.SPORTS_COMPLEXES}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    console.log("Gọi API lấy khu thể thao:", url);
    const response = await axiosInstance.get(url);

    if (
      response.data.isSuccessed &&
      response.data.resultObj?.items &&
      Array.isArray(response.data.resultObj.items)
    ) {
      // Lọc các khu thể thao có owner.id trùng với ownerId truyền vào
      const filtered = response.data.resultObj.items.filter(
        (item) => item.owner?.id?.toString() === ownerId.toString()
      );
      console.log(
        `Tổng số khu thể thao của ownerId=${ownerId} trên trang ${pageNumber}: ${filtered.length}`
      );
      return filtered;
    }
    return [];
  } catch (error) {
    console.error("Lỗi khi lấy khu thể thao theo ownerId:", error);
    throw error;
  }
};

// Hàm lấy sân theo SportsComplexId với phân trang
export const fetchCourtsBySportsComplexId = async (
  sportsComplexId,
  pageNumber = 1,
  pageSize = 10000
) => {
  try {
    const url = getApiUrl(
      `${ENDPOINTS.OWNER.SPORTS_COMPLEXES_DETAIL}?sportId=${sportsComplexId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    console.log("Gọi API lấy sân:", url);

    const response = await axiosInstance.get(url);

    if (
      response.data.isSuccessed &&
      response.data.resultObj?.items &&
      Array.isArray(response.data.resultObj.items)
    ) {
      console.log(
        `Tổng sân trong khu thể thao ${sportsComplexId}:`,
        response.data.resultObj.items.length
      );
      return response.data.resultObj.items;
    }

    return [];
  } catch (error) {
    console.error("Lỗi khi lấy sân theo SportsComplexId:", error);
    throw error;
  }
};

/**
 * Lấy tổng giá tiền booking theo courtId, phương thức thanh toán, tháng và năm
 * @param {number|string} courtId - ID sân
 * @param {string} VNPay - phương thức thanh toán (VD: "VNPay")
 * @param {number|string} month - tháng (VD: 5)
 * @param {number|string} year - năm (VD: 2025)
 * @returns {Promise<number|null>} totalPrice hoặc null nếu lỗi
 */
export const fetchTotalPriceByOwner = async (
  ownerId,
  paymentMethod,
  month,
  year
) => {
  try {
    const url = getApiUrl(
      `${
        ENDPOINTS.OWNER.TOTAL_PRICE
      }?ownerId=${ownerId}&paymentMethod=${encodeURIComponent(
        paymentMethod
      )}&month=${month}&year=${year}`
    );
    console.log("Calling Total Price API: ", url);
    const response = await axiosInstance.get(url);

    if (response.data.isSuccessed && response.data.resultObj) {
      return response.data.resultObj.totalPrice || 0;
    }
    return null;
  } catch (error) {
    console.error("Lỗi khi lấy tổng giá tiền:", error);
    throw error;
  }
};

// Lấy chi tiết employee theo id
export const fetchEmployeeById = async (employeeId) => {
  try {
    const url = getApiUrl(
      `${ENDPOINTS.EMPLOYEE.GET_EMPLOYEE_BY_ID}/${employeeId}`
    );
    console.log("Calling Employee Detail API:", url);
    const response = await axiosInstance.get(url);
    if (response.data.isSuccessed) {
      return response.data.resultObj;
    }
    return null;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin employee:", error);
    throw error;
  }
};

/**
 * Tạo khu thể thao mới
 * @param {FormData} formData - Đối tượng FormData chứa tất cả dữ liệu, bao gồm cả file ảnh.
 * @returns {Promise<Object>} Kết quả API trả về
 */
export const createSportsComplex = async (formData) => {
  // <--- Accept FormData directly
  try {
    const url = getApiUrl(ENDPOINTS.OWNER.CREATE_SPORTS_COMPLEX);

    console.log("Calling createSportsComplex API with FormData:");
    // For debugging, you can log formData entries (for inspection in console)
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Axios automatically sets Content-Type to multipart/form-data when sending FormData
    const response = await axiosInstance.post(url, formData); // <--- Send FormData directly

    // Assuming your API returns { isSuccessed: true, resultObj: {...} } on success
    // Or just the result object directly if isSuccessed is implied by 2xx status code
    if (response.status >= 200 && response.status < 300) {
      // Check if response.data has 'isSuccessed' property, or just return the data
      if (
        response.data &&
        typeof response.data === "object" &&
        "isSuccessed" in response.data
      ) {
        if (response.data.isSuccessed) {
          return response.data.resultObj || response.data;
        } else {
          throw new Error(
            response.data.message || "Tạo khu thể thao thất bại (API báo lỗi)"
          );
        }
      } else {
        // If isSuccessed is not present, assume 2xx means success and return the data
        return response.data;
      }
    } else {
      // For non-2xx status codes, throw an error
      throw new Error(`Request failed with status code ${response.status}`);
    }
  } catch (error) {
    console.error(
      "Lỗi khi gọi createSportsComplex:",
      error.response?.data || error.message || error
    );
    // Re-throw the error so the calling component can handle specific error messages
    throw error;
  }
};

/**
 * Tạo sân mới (court)
 * @param {Object} payload
 * @param {number|string} payload.SportsComplexId - ID khu thể thao cha
 * @param {string} payload.Name - Tên sân
 * @param {string} payload.Description - Mô tả sân
 * @param {number|string} payload.PricePerHour - Giá tiền mỗi giờ
 * @param {File[]} payload.ImageUrls - Mảng file ảnh (File objects)
 * @returns {Promise<Object>} Kết quả API trả về
 */
export const createCourt = async ({
  SportsComplexId,
  Name,
  Description,
  PricePerHour,
  ImageUrls = [],
}) => {
  try {
    const url = getApiUrl(ENDPOINTS.OWNER.CREATE_COURT); // giả sử ENDPOINTS.OWNER.CREATE_COURT = "/court/create"

    const formData = new FormData();
    formData.append("SportsComplexId", SportsComplexId.toString());
    formData.append("Name", Name);
    formData.append("Description", Description);
    formData.append("PricePerHour", PricePerHour.toString());

    // Gửi nhiều ảnh cùng key ImageUrls
    ImageUrls.forEach((file) => {
      formData.append("ImageUrls", file);
    });

    const response = await axiosInstance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.isSuccessed) {
      return response.data.resultObj;
    } else {
      throw new Error(response.data.message || "Tạo sân thất bại");
    }
  } catch (error) {
    console.error("Lỗi khi gọi createCourt:", error);
    throw error;
  }
};

/**
 * Tạo URL thanh toán VNPay cho user với packageId, courtBookingId hoặc coachBookingId có thể null
 * @param {Object} params
 * @param {number} params.userId - Id người dùng
 * @param {number|null} params.courtBookingId - Id đặt sân (null nếu không có)
 * @param {number|null} params.coachBookingId - Id đặt huấn luyện viên (null nếu không có)
 * @param {number} params.packageId - Id gói thanh toán
 * @returns {Promise<string>} trả về URL thanh toán hoặc throw lỗi
 */
export const createVnPayUrl = async ({
  userId,
  courtBookingId = null,
  coachBookingId = null,
  packageId,
}) => {
  try {
    const url = getApiUrl(ENDPOINTS.PAYMENT.CREATE_PAYMENT_VNPay);

    const payload = { userId, courtBookingId, coachBookingId, packageId };

    const response = await axiosInstance.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.status === 200 && response.data.isSuccessed) {
      // Lấy link từ response.data.message
      return response.data.message;
    } else {
      throw new Error("Lỗi khi tạo URL thanh toán");
    }
  } catch (error) {
    console.error("Lỗi khi gọi createVnPayUrl:", error);
    throw error;
  }
};
