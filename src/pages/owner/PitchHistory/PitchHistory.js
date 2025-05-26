import { memo, useState } from "react";
import "./style.scss";
import CircleStat from "../CircleStat";

const dataInit = [
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
];

const statusColors = {
  Confirmed: "#94d82d",
  Pending: "#fcc419",
  Cancelled: "#495057",
};

const PitchHistory = () => {
  const [filter, setFilter] = useState("Mới nhất");
  const [data, setData] = useState(dataInit);

  const totalOrders = data.length;
  const completed = data.filter((d) => d.status === "Confirmed").length;
  const inProgress = data.filter((d) => d.status === "Pending").length;
  const cancelled = data.filter((d) => d.status === "Cancelled").length;

  const handleStatusChange = (index, newStatus) => {
    const newData = [...data];
    newData[index].status = newStatus;
    setData(newData);
  };

  return (
    <div className="pitchHistory">
      <div className="summary">
        <div>
          <CircleStat title="Tổng đơn" value={totalOrders} percentage={75} />
        </div>
        <div>
          <CircleStat title="Đã hoàn thành" value={completed} percentage={75} />
        </div>
        <div>
          <CircleStat
            title="Đang thực hiện"
            value={inProgress}
            percentage={75}
          />
        </div>
        <div>
          <CircleStat title="Đã hủy" value={cancelled} percentage={75} />
        </div>
      </div>

      <div className="historySection">
        <div className="header">
          <h2>Lịch sử đặt sân</h2>
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
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(idx, e.target.value)}
                      style={{
                        backgroundColor: statusColors[item.status],
                        color: "white",
                        border: "none",
                        padding: "4px 8px",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
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
