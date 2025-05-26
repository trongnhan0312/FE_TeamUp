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

export const fetchBookingHistory = async (pageNumber = 1, pageSize = 5) => {
  try {
    const url = getApiUrl(
      `${ENDPOINTS.OWNER.BOOKING_HISTORY}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
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

    const url = `${ENDPOINTS.OWNER.BOOKING_UPDATE}/${bookingId}`;
    const response = await axiosInstance.put(url, formData, {
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
