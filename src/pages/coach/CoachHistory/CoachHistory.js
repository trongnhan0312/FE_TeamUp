import { memo, useState } from "react";
import "./style.scss";
import CircleStat from "../../owner/CircleStat";
const data = [
  {
    name: "Elena Winston",
    code: "QW-MN6789",
    date: "03/03/2025",
    time: "08:25 - 10:30",
    field: "Cầu lông 1",
    price: 248000,
    status: "Confirmed",
  },
  {
    name: "Elena Winston",
    code: "QW-MN6789",
    date: "03/03/2025",
    time: "08:25 - 10:30",
    field: "Cầu lông 1",
    price: 248000,
    status: "Pending",
  },
  {
    name: "Elena Winston",
    code: "QW-MN6789",
    date: "03/03/2025",
    time: "08:25 - 10:30",
    field: "Cầu lông 1",
    price: 248000,
    status: "Cancelled",
  },
  // Thêm các dòng giống mẫu, hoặc nhiều bản ghi tương tự...
];

const statusColors = {
  Confirmed: "#94d82d",
  Pending: "#fcc419",
  Cancelled: "#495057",
};

const CoachHistory = () => {
  const [filter, setFilter] = useState("Mới nhất");

  const totalOrders = 346;
  const completed = 346;
  const inProgress = 346;
  const cancelled = 346;

  return (
    <div className="pitchHistory">
      <div className="summary">
        <div>
          <CircleStat title="Tổng đơn" value={totalOrders} percentage={75} />
        </div>
        <div>
          <CircleStat title="Đã hoàn thành" value={completed} percentage={75} />
        </div>{" "}
        <div>
          <CircleStat
            title="Đang thực hiện"
            value={inProgress}
            percentage={75}
          />
        </div>{" "}
        <div>
          <CircleStat title="Đã hủy" value={cancelled} percentage={75} />
        </div>
      </div>

      <div className="historySection">
        <div className="header">
          <h2>Tình Trạng Đơn</h2>
          <div className="filters">
            <input type="text" placeholder="Tìm kiếm" className="searchInput" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="statusFilter"
            >
              <option>Mới nhất</option>
              <option>Cũ nhất</option>
              <option>Xác nhận</option>
            </select>
          </div>
          <div className="timeFilter">
            <button className="active">Tuần</button>
            <button>Tháng</button>
            <button>Năm</button>
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
              {data.map((item, idx) => (
                <tr key={idx}>
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
                    <span
                      className="statusLabel"
                      style={{ backgroundColor: statusColors[item.status] }}
                    >
                      {item.status}
                    </span>
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

export default memo(CoachHistory);
