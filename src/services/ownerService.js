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
  pageSize = 10000
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
      `${ENDPOINTS.OWNER.SPORTS_COMPLEXES_DETAIL}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    console.log("Gọi API lấy sân:", url);
    const response = await axiosInstance.get(url);

    if (
      response.data.isSuccessed &&
      response.data.resultObj?.items &&
      Array.isArray(response.data.resultObj.items)
    ) {
      // Lọc các sân thuộc sportsComplexId
      const filteredCourts = response.data.resultObj.items.filter(
        (court) =>
          court.sportsComplexModelView?.id?.toString() ===
          sportsComplexId.toString()
      );
      console.log(
        `Tổng sân trong khu thể thao ${sportsComplexId}:`,
        filteredCourts.length
      );
      return filteredCourts;
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
 * @param {Object} payload
 * @param {string} payload.Type - Loại sân (ví dụ "Bóng đá")
 * @param {string} payload.Name - Tên khu thể thao
 * @param {string} payload.Address - Địa chỉ khu thể thao
 * @param {string[]} payload.ImageUrls - Mảng URL ảnh (string)
 * @param {number} payload.OwnerId - ID chủ sở hữu
 * @param {number} [payload.Latitude] - Tọa độ vĩ độ, có thể null hoặc undefined
 * @param {number} [payload.Longitude] - Tọa độ kinh độ, có thể null hoặc undefined
 * @returns {Promise<Object>} Kết quả API trả về
 */
export const createSportsComplex = async ({
  Type,
  Name,
  Address,
  ImageUrls,
  OwnerId,
  Latitude = null,
  Longitude = null,
}) => {
  try {
    const url = getApiUrl(ENDPOINTS.OWNER.CREATE_SPORTS_COMPLEX);

    const payload = {
      Type,
      Name,
      Address,
      ImageUrls,
      OwnerId,
      Latitude,
      Longitude,
    };

    console.log("Calling createSportsComplex API with payload:", payload);

    const response = await axiosInstance.post(url, payload);

    if (response.data.isSuccessed) {
      return response.data.resultObj;
    } else {
      throw new Error(response.data.message || "Tạo khu thể thao thất bại");
    }
  } catch (error) {
    console.error("Lỗi khi gọi createSportsComplex:", error);
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
