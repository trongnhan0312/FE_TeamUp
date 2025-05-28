import { memo, useEffect, useState } from "react";
import "./style.scss";
import CircleStat from "../../owner/CircleStat";
import coachBookingService from "../../../services/coachBookingService";
import { getUserInfo } from "../../../utils/auth";

const statusColors = {
  Confirmed: "#94d82d",
  Pending: "#fcc419",
  Cancelled: "#495057",
};

const CoachHistory = () => {
  const [filter, setFilter] = useState("Mới nhất");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [coachBookingData, setCoachBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  const coachId = getUserInfo().id;

  useEffect(() => {
    const fetchCoachBooking = async () => {
      try {
        setLoading(true);
        const data = await coachBookingService.getAllByCoachId(coachId, page, pageSize);
        setCoachBookingData(data.resultObj);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin coach booking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoachBooking();
  }, [coachId, page]);

  const completed = 120;
  const inProgress = 30;
  const cancelled = 10;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= coachBookingData.totalPages) {
      setPage(newPage);
    }
  };

  const formatSlotsByDate = (slots) => {
    const grouped = slots.reduce((acc, slot) => {
      const date = new Date(slot.startTime.replace(" ", "T")).toLocaleDateString("vi-VN");
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
            <input type="text" placeholder="Tìm kiếm" className="search-input" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="status-filter">
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
                    {(item.totalPrice - item.discountAmount).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td>
                    <span
                      className="status-label"
                      style={{ backgroundColor: statusColors[item.status] || "#adb5bd" }}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {coachBookingData?.totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={!coachBookingData.hasPreviousPage}
            >
              &laquo;
            </button>
            <span>{page} / {coachBookingData.totalPages}</span>
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
        <CircleStat title="Tổng đơn" value={coachBookingData?.totalItems} percentage={75} />
        <CircleStat title="Đã hoàn thành" value={completed} percentage={80} />
        <CircleStat title="Đang thực hiện" value={inProgress} percentage={15} />
        <CircleStat title="Đã hủy" value={cancelled} percentage={5} />
      </div>
    </div>
  );
};

export default memo(CoachHistory);
