import { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👉 thêm dòng này
import "./style.scss";
import CircleStat from "../../owner/CircleStat";
import coachBookingService from "../../../services/coachBookingService";
import { getUserInfo } from "../../../utils/auth";
import { toast } from "react-toastify";
import { statusColors } from "../../../data";
import { ROUTER } from "../../../utils/router"; // nếu bạn dùng object ROUTER
const CoachHistory = () => {
  const [filter, setFilter] = useState("Mới nhất");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [coachBookingData, setCoachBookingData] = useState(null);
  const navigate = useNavigate(); // 👉 sử dụng điều hướng

  const coachId = getUserInfo().id;

  const fetchCoachBooking = useCallback(async () => {
    try {
      const data = await coachBookingService.getAllByCoachId(
        coachId,
        page,
        pageSize
      );
      setCoachBookingData(data.resultObj);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin coach booking:", error);
    }
  }, [coachId, page, pageSize]);

  useEffect(() => {
    fetchCoachBooking();
  }, [fetchCoachBooking]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= coachBookingData.totalPages) {
      setPage(newPage);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await coachBookingService
        .updateStatus(bookingId, newStatus)
        .then(fetchCoachBooking);
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleViewDetail = (bookingId) => {
    navigate(
      ROUTER.COACH.COACH_BOOKING_DETAIL.replace(":bookingId", bookingId)
    );
  };

  const formatSlotsByDate = (slots) => {
    const grouped = slots.reduce((acc, slot) => {
      const date = new Date(
        slot.startTime.replace(" ", "T")
      ).toLocaleDateString("vi-VN");
      const start = new Date(slot.startTime.replace(" ", "T"));
      const end = new Date(slot.endTime.replace(" ", "T"));

      const timeStr = `${start.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })} - ${end.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}`;

      if (!acc[date]) acc[date] = [];
      acc[date].push(timeStr);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([date, times]) => `${date}: ${times.join(", ")}`)
      .join("\n");
  };

  return (
    <div className="coach-history">
      <div className="history-section">
        <div className="header">
          <h2>Tình Trạng Đơn</h2>
          <div className="filters">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="search-input"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="status-filter"
            >
              <option>Mới nhất</option>
              <option>Cũ nhất</option>
              <option>Xác nhận</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Người đặt sân</th>
                <th>Mã đơn</th>
                <th>Thời gian huấn luyện</th>
                <th>Sân</th>
                <th>Thu nhập</th>
                <th>Trạng thái</th>
                <th>Thao tác</th> {/* 👉 thêm cột thao tác */}
              </tr>
            </thead>
            <tbody>
              {coachBookingData?.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.player.fullName}</td>
                  <td>{item.id}</td>
                  <td style={{ whiteSpace: "pre-line" }}>
                    {formatSlotsByDate(item.slots)}
                  </td>
                  <td>{item.court.name}</td>
                  <td>
                    {(item.totalPrice - item.discountAmount).toLocaleString(
                      "vi-VN",
                      {
                        style: "currency",
                        currency: "VND",
                      }
                    )}
                  </td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value)
                      }
                      style={{
                        backgroundColor: statusColors[item.status] || "#888",
                        color: "white",
                        border: "none",
                        padding: "4px 8px",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="CancelledByCoach">
                        Cancelled By Coach
                      </option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="action-button detail-btn"
                      onClick={() => handleViewDetail(item.id)}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {coachBookingData?.totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={!coachBookingData.hasPreviousPage}
            >
              &laquo;
            </button>
            <span>
              {page} / {coachBookingData.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={!coachBookingData.hasNextPage}
            >
              &raquo;
            </button>
          </div>
        )}
      </div>

      <div className="summary">
        <CircleStat title="Tổng đơn" value={coachBookingData?.totalItems} />
      </div>
    </div>
  );
};

export default memo(CoachHistory);
