import { memo, useState, useEffect } from "react";
import "./style.scss";
import CircleStat from "../CircleStat";
import {
  fetchBookingHistory,
  updateBooking,
} from "../../../services/ownerService";
import { toast } from "react-toastify";
import { statusColors } from "../../../data";
import { getUserInfo } from "../../../utils/auth";
const PitchHistory = () => {
  const [filter, setFilter] = useState("Mới nhất");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("Tuần"); // Thêm state timeFilter
  const [rawData, setRawData] = useState([]);
  const [data, setData] = useState([]);
  const userInfo = getUserInfo();
  const ownerId = userInfo?.id;
  // Lấy dữ liệu từ API khi mount hoặc timeFilter thay đổi (nếu cần lọc server theo time)
  useEffect(() => {
    fetchBookingHistory(ownerId, 1, 5)
      .then((items) => {
        const formatted = items.map((item) => ({
          id: item.id,
          name: item.user?.fullName || "N/A",
          code: item.id,
          rawDate: item.startTime,
          date: new Date(item.startTime).toLocaleDateString("vi-VN"),
          time: `${new Date(item.startTime).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })} - ${new Date(item.endTime).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
          field: item.court?.name || "N/A",
          price: item.totalPrice || 0,
          status: item.status || "Pending",
        }));
        setRawData([...formatted]);
      })
      .catch(console.error);
  }, [timeFilter]); // Nếu muốn gọi lại theo timeFilter

  // Lọc, sort, tìm kiếm khi filter, searchTerm hoặc rawData thay đổi
  useEffect(() => {
    let filtered = [...rawData];

    if (filter === "Mới nhất") {
      filtered.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
    } else if (filter === "Cũ nhất") {
      filtered.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
    } else if (filter === "Xác nhận") {
      const acceptedStatuses = ["confirmed", "completed"];
      filtered = filtered.filter(
        (item) =>
          item.status &&
          acceptedStatuses.includes(item.status.trim().toLowerCase())
      );
    }

    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        [
          item.name,
          item.code,
          item.date,
          item.time,
          item.field,
          item.price.toString(),
          item.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(lowerSearch)
      );
    }

    setData(filtered);
  }, [filter, searchTerm, rawData]);

  // Thống kê đơn
  const totalOrders = rawData.length;
  const completed = rawData.filter((d) => d.status === "Completed").length;
  const inProgress = rawData.filter((d) => d.status === "Pending").length;
  const cancelled = rawData.filter(
    (d) => d.status === "CancelledByOwner"
  ).length;

  // Cập nhật trạng thái booking
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBooking(bookingId, newStatus);
      console.log(
        `Cập nhật trạng thái booking ${bookingId} thành ${newStatus}`
      );
      const items = await fetchBookingHistory(ownerId, 1, 5);

      const formatted = items.map((item) => ({
        id: item.id,
        name: item.user?.fullName || "N/A",
        code: item.id,
        rawDate: item.startTime,
        date: new Date(item.startTime).toLocaleDateString("vi-VN"),
        time: `${new Date(item.startTime).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })} - ${new Date(item.endTime).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        field: item.court?.name || "N/A",
        price: item.totalPrice || 0,
        status: item.status || "Pending",
      }));

      setRawData([...formatted]);
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };
  const completedPercentage = (completed / totalOrders) * 100;
  const cancelledPercentage = (cancelled / totalOrders) * 100;
  return (
    <div className="pitchHistory">
      <div className="summary">
        <CircleStat
          title="Tổng đơn"
          value={totalOrders}
          percentage={100} // Tổng đơn luôn bằng 100%
        />

        <CircleStat
          title="Đã hoàn thành"
          value={completed}
          percentage={Math.min(completedPercentage, 100)} // Giới hạn phần trăm không quá 100%
        />

        <CircleStat
          title="Đã hủy"
          value={cancelled}
          percentage={Math.min(cancelledPercentage, 100)} // Giới hạn phần trăm không quá 100%
        />
      </div>

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
              onChange={(e) => setFilter(e.target.value)}
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
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.code}</td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td>{item.field}</td>
                  <td>
                    {item.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
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
                      <option value="CancelledByOwner">CancelledByOwner</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default memo(PitchHistory);
