import { memo, useState } from "react";
import "./style.scss";
const scheduleData = [
  { day: 2, timeSlots: ["09:00", "11:00"] },
  { day: 2, timeSlots: ["13:00", "14:00"] },
  { day: 4, timeSlots: ["10:00"] },
  { day: 5, timeSlots: ["12:00", "14:00"] },
];

const paymentHistory = [
  {
    user: "Elena Winston",
    orderId: "QW-MN6789",
    date: "03/03/2025",
    time: "08:25 - 10:30",
    income: "+248.000VND",
    status: "Confirmed",
  },
  {
    user: "Elena Winston",
    orderId: "QW-MN6789",
    date: "03/03/2025",
    time: "08:25 - 10:30",
    income: "248.000VND",
    status: "Pending",
  },
  {
    user: "Elena Winston",
    orderId: "QW-MN6789",
    date: "03/03/2025",
    time: "08:25 - 10:30",
    income: "+248.000VND",
    status: "Confirmed",
  },
  {
    user: "Elena Winston",
    orderId: "QW-MN6789",
    date: "03/03/2025",
    time: "08:25 - 10:30",
    income: "Cancelled",
    status: "Cancelled",
  },
  {
    user: "Elena Winston",
    orderId: "QW-MN6789",
    date: "03/03/2025",
    time: "08:25 - 10:30",
    income: "+248.000VND",
    status: "Confirmed",
  },
];

const students = [
  { name: "Nguyễn Thị Linh", avatar: "/avatar1.jpg" },
  { name: "Tăng Mai Phương", avatar: "/avatar1.jpg" },
  { name: "Trần Anh Nhân", avatar: "/avatar1.jpg" },
  { name: "Vũ Hoài", avatar: "/avatar1.jpg" },
];

const daysOfWeek = [
  { label: "THỨ 2", num: 2 },
  { label: "THỨ 3", num: 3 },
  { label: "THỨ 4", num: 4 },
  { label: "THỨ 5", num: 5 },
  { label: "THỨ 6", num: 6 },
  { label: "THỨ 7", num: 7 },
  { label: "CHỦ NHẬT", num: 8 },
];

const times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

const statusColors = {
  Confirmed: "#8bc34a",
  Pending: "#c5e1a5",
  Cancelled: "#e57373",
};

function CircleProgress({ percentage = 75, size = 44 }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      className="circle-progress-svg"
    >
      <path
        className="circle-bg"
        d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="#eee"
        strokeWidth="3.8"
      />
      <path
        className="circle"
        stroke="#8bc34a"
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
      />
    </svg>
  );
}

const Coach = () => {
  const [search, setSearch] = useState("");
  const [sortNewest, setSortNewest] = useState(true);

  const sortedPayments = [...paymentHistory].sort((a, b) => {
    const dateA = new Date(a.date.split("/").reverse().join("-"));
    const dateB = new Date(b.date.split("/").reverse().join("-"));
    return sortNewest ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="coach-container">
      {/* Top Stats */}
      <div className="stats-top">
        <div className="stat-card">
          <div className="stat-title">Số giờ thuê</div>
          <div className="stat-value">346</div>
          <div className="stat-progress">
            <CircleProgress percentage={75} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Số học viên</div>
          <div className="stat-value">08</div>
          <div className="stat-progress">
            <CircleProgress percentage={75} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Doanh thu hôm nay</div>
          <div className="stat-value">221</div>
          <div className="stat-progress">
            <CircleProgress percentage={75} />
          </div>
        </div>
        <div className="stat-card no-progress">
          <div className="stat-title">Tổng doanh thu</div>
          <div className="stat-value">xx.000.000</div>
        </div>
      </div>

      {/* Mid Section */}
      <div className="mid-section">
        <div className="left-panel">
          <div className="total-week-container">
            <div className="total-week-text">Tổng số đơn tuần này</div>
            <div className="total-week-circle">
              <svg
                width="110"
                height="110"
                viewBox="0 0 36 36"
                className="big-circle-svg"
              >
                <path
                  className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  stroke="#f0f0f0"
                  strokeWidth="8"
                  fill="none"
                />
                <path
                  className="circle"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  stroke="#8bc34a"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="65 100"
                />
              </svg>
              <div className="total-week-number">65</div>
            </div>
          </div>

          <div className="rating-box">
            <div className="rating-label">Đánh giá</div>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#FF9800"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="schedule">
            <div className="schedule-header">
              <div className="time-column">
                {times.map((time) => (
                  <div key={time} className="time-cell">
                    {time}
                  </div>
                ))}
              </div>
              <div className="days-column">
                {daysOfWeek.map((day) => (
                  <div key={day.num} className="day-cell">
                    <div className="day-label">{day.label}</div>
                    <div className="day-num">
                      {day.num < 10 ? `0${day.num}` : day.num}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="schedule-body">
              {/* Left time labels */}
              <div className="time-labels">
                {times.map((time) => (
                  <div key={time} className="time-label">
                    {time}
                  </div>
                ))}
              </div>

              <div className="schedule-grid">
                {times.map((time, i) => (
                  <div key={time} className="row">
                    {daysOfWeek.map((day) => {
                      // Check if slot is active (simplified)
                      let active = false;
                      let tall = false;

                      // hardcode for example for Thu 2 (2), Thu 4 (4), Thu 5 (5)
                      if (
                        (day.num === 2 &&
                          (time === "09:00" || time === "13:00")) ||
                        (day.num === 4 && time === "10:00") ||
                        (day.num === 5 &&
                          (time === "12:00" || time === "13:00"))
                      ) {
                        active = true;
                        if (day.num === 5 && time === "12:00") tall = true;
                      }

                      return (
                        <div
                          key={day.num}
                          className={`cell ${active ? "active" : ""} ${
                            tall ? "tall" : ""
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="payment-history-header">
        <div className="payment-history">
          <div className="payment-header">
            <input
              type="text"
              placeholder="Search placeholder"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button
              className="sort-button"
              onClick={() => setSortNewest(!sortNewest)}
            >
              Mới nhất
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="#7CBA00"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>

          <table className="payment-table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Mã đơn</th>
                <th>Ngày</th>
                <th>Thời gian</th>
                <th>Thu nhập</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {sortedPayments
                .filter((p) =>
                  p.user.toLowerCase().includes(search.toLowerCase())
                )
                .map((item, i) => (
                  <tr key={i}>
                    <td>{item.user}</td>
                    <td>{item.orderId}</td>
                    <td>{item.date}</td>
                    <td>{item.time}</td>
                    <td>{item.income}</td>
                    <td>
                      <span
                        className="status-label"
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

        <div className="students-list">
          <strong className="payment-history-title">
            <p>Học Viên</p>
          </strong>
          {students.map((student, idx) => (
            <div key={idx} className="student-item">
              <img src={student.avatar} alt={student.name} />
              <div className="student-name">{student.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default memo(Coach);
