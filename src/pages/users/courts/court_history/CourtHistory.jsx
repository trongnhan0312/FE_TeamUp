import { memo, useState, useEffect } from "react";
import "./CourtHistory.scss";
import courtBookingService from "../../../../services/courtBookingService";
import { getUserInfo } from "../../../../utils/auth";
import Swal from "sweetalert2";

const statusColors = {
  Pending: "#ff9800",
  Confirmed: "#2196f3",
  Completed: "#94d82d",
  CancelledByOwner: "#f44336",
};

const CourtHistory = () => {
  const [filter, setFilter] = useState("Mới nhất");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("Tuần");
  const [bookingHistory, setBookingHistory] = useState(null);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchData = async () => {
    const response = await courtBookingService.getCourtBookingList(
      getUserInfo().id,
      currentPage,
      pageSize
    );
    const result = response.resultObj;
    setBookingHistory(result);
    setData(result.items);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredData = data
    .filter((item) => {
      if (filter === "Xác nhận") {
        return ["Confirmed", "Completed"].includes(item.status);
      }
      return true;
    })
    .filter((item) => {
      if (!searchTerm) return true;
      const lowerSearch = searchTerm.toLowerCase();
      return (
        item.user?.fullName?.toLowerCase().includes(lowerSearch) ||
        item.court?.name?.toLowerCase().includes(lowerSearch)
      );
    });

  const formatDate = (datetimeStr) =>
    new Date(datetimeStr).toLocaleDateString("vi-VN");
  const formatTime = (start, end) => {
    const s = new Date(start).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const e = new Date(end).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${s} - ${e}`;
  };

  // Chưa handle cho nút tạo phòng
  const handleCreateRoom = (id) => {
    console.log("Tạo phòng chơi cho booking", id);
  };

  const handleComplete = async (id) => {
    const result = await Swal.fire({
      title: "Xác nhận hoàn thành?",
      text: "Bạn có chắc muốn đánh dấu đơn này là đã hoàn thành?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Hoàn thành",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await courtBookingService.updateStatus(id, "Completed");
        Swal.fire("Thành công", "Đơn đã được đánh dấu hoàn thành", "success");
        await fetchData();
      } catch (error) {
        Swal.fire("Lỗi", "Không thể cập nhật trạng thái", "error");
      }
    }
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Xác nhận hủy?",
      text: "Bạn có chắc muốn hủy đơn đặt sân này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hủy đơn",
      cancelButtonText: "Quay lại",
    });

    if (result.isConfirmed) {
      try {
        await courtBookingService.updateStatus(id, "CancelledByUser");
        Swal.fire("Đã hủy", "Đơn đặt sân đã được hủy", "success");
        await fetchData();
      } catch (error) {
        Swal.fire("Lỗi", "Không thể hủy đơn", "error");
      }
    }
  };

  return (
    <div className="pitchHistory">
      <div className="historySection">
        <div className="header">
          <h2>Lịch sử đặt sân</h2>
          <div className="filters">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="searchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={filter}
              onChange={handleFilterChange}
              className="statusFilter"
            >
              <option value="Mới nhất">Mới nhất</option>
              <option value="Cũ nhất">Cũ nhất</option>
              <option value="Xác nhận">Xác nhận</option>
            </select>
          </div>
          <div className="timeFilter">
            {["Tuần", "Tháng", "Năm"].map((label) => (
              <button
                key={label}
                className={timeFilter === label ? "active" : ""}
                onClick={() => setTimeFilter(label)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="tableWrapper">
          <table>
            <thead>
              <tr>
                <th>Người đặt sân</th>
                <th>Mã đơn</th>
                <th>Ngày</th>
                <th>Thời gian</th>
                <th>Sân</th>
                <th>Thu nhập</th>
                <th>Trạng thái</th>
                <th>Thao tác</th> {/* Cột thao tác mới */}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.user?.fullName}</td>
                  <td>{item.id}</td>
                  <td>{formatDate(item.startTime)}</td>
                  <td>{formatTime(item.startTime, item.endTime)}</td>
                  <td>{item.court?.name}</td>
                  <td>
                    {item.totalPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td>
                    <span
                      style={{ color: statusColors[item.status] || "gray" }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {(item.status === "Pending" ||
                      item.status === "Confirmed") && (
                      <button
                        className="action-button create-room"
                        onClick={() => handleCreateRoom(item.id)}
                        aria-label={`Tạo phòng chơi cho booking ${item.id}`}
                      >
                        Tạo phòng chơi
                      </button>
                    )}
                    {item.status === "Confirmed" && (
                      <button
                        className="action-button complete"
                        onClick={() => handleComplete(item.id)}
                        aria-label={`Hoàn thành booking ${item.id}`}
                      >
                        Hoàn thành
                      </button>
                    )}
                    {item.status === "Pending" && (
                      <button
                        className="action-button cancel"
                        onClick={() => handleCancel(item.id)}
                        aria-label={`Hủy booking ${item.id}`}
                      >
                        Hủy
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {bookingHistory?.totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={bookingHistory?.hasPreviousPage === false}
              aria-label="Trang trước"
            >
              &#8592;
            </button>
            <span className="pagination-info">
              {bookingHistory.currentPage} / {bookingHistory.totalPages}
            </span>
            <button
              className="pagination-button"
              onClick={() =>
                setCurrentPage((prev) =>
                  bookingHistory?.hasNextPage ? prev + 1 : prev
                )
              }
              disabled={bookingHistory?.hasNextPage === false}
              aria-label="Trang sau"
            >
              &#8594;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CourtHistory);
