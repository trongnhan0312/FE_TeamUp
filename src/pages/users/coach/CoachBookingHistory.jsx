import { memo, useState, useEffect } from "react";
import "../courts/court_history/CourtHistory.scss";
import Swal from "sweetalert2";
import courtBookingService from "../../../services/courtBookingService";
import { getUserInfo } from "../../../utils/auth";
import coachBookingService from "../../../services/coachBookingService";

const statusColors = {
  Pending: "#ff9800",
  Confirmed: "#2196f3",
  Completed: "#94d82d",
  CancelledByOwner: "#f44336",
};

const formatDateDMY = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const formatTimeHM = (dateStr) => {
  const date = new Date(dateStr);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const groupSlotsByDate = (slots) => {
  const groups = {};

  slots.forEach(({ startTime, endTime }) => {
    const day = formatDateDMY(startTime);
    const timeRange = `${formatTimeHM(startTime)} - ${formatTimeHM(endTime)}`;
    if (!groups[day]) {
      groups[day] = [];
    }
    groups[day].push(timeRange);
  });

  return groups;
};

const CoachBookingHistory = () => {
  const [filter, setFilter] = useState("Mới nhất");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("Tuần");
  const [bookingHistory, setBookingHistory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchData = async () => {
    const response = await coachBookingService.getAllByUserId(
      getUserInfo().id,
      currentPage,
      pageSize
    );
    const result = response.resultObj;
    setBookingHistory(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredData = bookingHistory?.items
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
        await coachBookingService.updateStatus(id, "Completed");
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
        await coachBookingService.updateStatus(id, "CancelledByUser");
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
          <h2>Lịch sử đặt HLV</h2>
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
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Coach</th>
                <th className="border border-gray-300 p-2">Booking ID</th>
                <th className="border border-gray-300 p-2">Slots</th>
                <th className="border border-gray-300 p-2">Court</th>
                <th className="border border-gray-300 p-2">Price</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((item) => {
                const groupedSlots = groupSlotsByDate(item.slots || []);

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">
                      {item.coach?.fullName}
                    </td>
                    <td className="border border-gray-300 p-2">{item.id}</td>
                    <td className="border border-gray-300 p-2">
                      {Object.entries(groupedSlots).map(([date, times]) => (
                        <div key={date}>
                          {date}: {times.join(", ")}
                        </div>
                      ))}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.court?.name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.totalPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td
                      className="border border-gray-300 p-2"
                      style={{ color: statusColors[item.status] || "gray" }}
                    >
                      {item.status}
                    </td>
                    <td className="border border-gray-300 p-2 space-x-2">
                      {/* {(item.status === "Pending" ||
                        item.status === "Confirmed") && (
                        <button
                          className="action-button create-room"
                          onClick={() => handleCreateRoom(item.id)}
                          aria-label={`Tạo phòng chơi cho booking ${item.id}`}
                        >
                          Tạo phòng chơi
                        </button>
                      )} */}
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
                );
              })}
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

export default memo(CoachBookingHistory);
