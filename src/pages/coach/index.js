import { memo, useEffect, useState } from "react";
import "./style.scss";
import { getUserInfo } from "../../utils/auth";
import coachBookingService from "../../services/coachBookingService";
import { formatPrice } from "../../utils/formatUtils";
import { statusColors } from "../../data";

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

const daysOfWeek = [
  { label: "THỨ 2", num: 2 },
  { label: "THỨ 3", num: 3 },
  { label: "THỨ 4", num: 4 },
  { label: "THỨ 5", num: 5 },
  { label: "THỨ 6", num: 6 },
  { label: "THỨ 7", num: 7 },
  { label: "CHỦ NHẬT", num: 8 },
];

const dayLabelToNum = {
  "Thứ Hai": 2,
  "Thứ Ba": 3,
  "Thứ Tư": 4,
  "Thứ Năm": 5,
  "Thứ Sáu": 6,
  "Thứ Bảy": 7,
  "Chủ Nhật": 8,
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

  const coachId = getUserInfo().id;

  const [coachStatsData, setCoachStatsData] = useState(null);
  const [playerListData, setPlayerListData] = useState([]);
  const [coachMonthlyTotal, setCoachMonthlyTotal] = useState(null);
  const [weeklyBookedSlots, setWeeklyBookedSlots] = useState([]);
  const [coachBookingData, setCoachBookingData] = useState(null);
  const [revenueInMonth, setRevenueInMonth] = useState(0)
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchCoachTotalPriceStats = async () => {
      try {
        const data = await coachBookingService.getCoachTotalPriceStats(coachId);
        setCoachStatsData(data.resultObj);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin coach booking:", error);
      }
    };

    const fetchPlayerList = async () => {
      try {
        const data = await coachBookingService.getPlayerList(coachId);
        setPlayerListData(data.resultObj);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin coach booking:", error);
      }
    };

    const fetchMonthlyTotal = async () => {
      try {
        const data = await coachBookingService.getMonthlyTotal(coachId);
        setCoachMonthlyTotal(data.resultObj);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin coach booking:", error);
      }
    };

    const fetchWeeklyBookedSlots = async () => {
      try {
        const data = await coachBookingService.getWeeklyBookedSlots(coachId);
        setWeeklyBookedSlots(data.resultObj);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin coach booking:", error);
      }
    };

    const fetchTotalPriceInMonth = async () => {
      try {
        const data = await coachBookingService.getTotalPriceThisMonth(coachId);
        setRevenueInMonth(data.resultObj.totalPrice);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin coach booking:", error);
      }
    }

    fetchCoachTotalPriceStats();
    fetchPlayerList();
    fetchMonthlyTotal();
    fetchWeeklyBookedSlots();
    fetchTotalPriceInMonth();
  }, [coachId])

  useEffect(() => {
    const fetchCoachBooking = async () => {
      try {
        const data = await coachBookingService.getAllByCoachId(coachId, page, pageSize);
        setCoachBookingData(data.resultObj);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin coach booking:", error);
      }
    }
    fetchCoachBooking();
  }, [coachId, page])

  function getTimeSlotsFromRange(range) {
    const [start, end] = range.split(" - ");
    const slots = [];
    let current = start;

    while (current < end) {
      slots.push(current);
      const [h, m] = current.split(":").map(Number);
      const nextH = h + 1;
      current = `${nextH < 10 ? "0" : ""}${nextH}:${m < 10 ? "0" : ""}${m}`;
    }

    return slots;
  }

  const allTimeSlots = Array.from(
    new Set(
      weeklyBookedSlots.flatMap((item) => getTimeSlotsFromRange(item.bookedSlot))
    )
  ).sort();

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= coachBookingData.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="coach-container">
      {/* Top Stats */}
      <div className="stats-top">
        <div className="stat-card">
          <div className="stat-title">Số giờ thuê</div>
          <div className="stat-value">{coachStatsData?.totalBookings}</div>
          <div className="stat-progress">
            <CircleProgress percentage={75} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Số học viên</div>
          <div className="stat-value">{coachStatsData?.uniqueStudents}</div>
          <div className="stat-progress">
            <CircleProgress percentage={75} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Doanh thu trong tháng</div>
          <div className="stat-value">{revenueInMonth}</div>
          <div className="stat-progress">
            <CircleProgress percentage={75} />
          </div>
        </div>
        <div className="stat-card no-progress">
          <div className="stat-title">Tổng doanh thu</div>
          <div className="stat-value">{coachStatsData?.totalRevenue}</div>
        </div>
      </div>

      {/* Mid Section */}
      <div className="mid-section">
        <div className="left-panel">
          <div className="total-week-container">
            <div className="total-week-text">Tổng số đơn tháng này</div>
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
              <div className="total-week-number">{coachMonthlyTotal?.totalBookings}</div>
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
            <div className="schedule-grid-wrapper">
              <div className="schedule-grid">
                <div className="cell header time-header" />
                {daysOfWeek.map((day) => (
                  <div key={day.num} className="cell header day-header">
                    <div className="day-label">{day.label}</div>
                  </div>
                ))}

                {allTimeSlots.map((time, rowIndex) => {
                  const startHour = time;
                  const [h, m] = time.split(":").map(Number);
                  const endHour = `${(h + 1).toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;

                  const rowCells = [
                    <div key={`label-${time}`} className="cell time-label sticky-left">
                      {startHour} - {endHour}
                    </div>,
                  ];

                  daysOfWeek.forEach((day) => {
                    const dayNum = day.num;
                    const matchedSchedule = weeklyBookedSlots.find((item) => {
                      const itemDayNum = dayLabelToNum[item.weekDay];
                      if (itemDayNum !== dayNum) return false;
                      const slots = getTimeSlotsFromRange(item.bookedSlot);
                      return slots.includes(time);
                    });

                    const key = `${dayNum}-${time}`;

                    if (matchedSchedule) {
                      const slots = getTimeSlotsFromRange(matchedSchedule.bookedSlot);
                      const firstSlot = slots[0];

                      if (time === firstSlot) {
                        // slot đầu tiên => render cell với rowSpan
                        rowCells.push(
                          <div
                            key={key}
                            className="cell schedule-cell active"
                            title="Đã được huấn luyện viên đặt"
                            style={{ gridRow: `span ${slots.length}` }}
                          />
                        );
                      } else {
                        // slot nằm giữa block => bỏ qua (đã merge rồi)
                        rowCells.push(<div key={key} style={{ display: "none" }} />);
                      }
                    } else {
                      rowCells.push(
                        <div
                          key={key}
                          className="cell schedule-cell"
                          title="Chưa đặt"
                        />
                      );
                    }
                  });

                  return rowCells;
                })}

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
                <th>Thu nhập</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {coachBookingData?.items
                .filter((p) =>
                  p?.player.fullName.toLowerCase().includes(search.toLowerCase())
                )
                .map((item, i) => (
                  <tr key={i}>
                    <td>{item?.player.fullName}</td>
                    <td>{item.id}</td>
                    <td>{formatPrice(item.totalPrice, true)}</td>
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

        <div className="students-list">
          <strong className="payment-history-title">
            <p>Học Viên</p>
          </strong>
          {playerListData.map((student, idx) => (
            <div key={idx} className="student-item">
              <img src={student.avaterUrl} alt={student.fullName} />
              <div className="student-name">{student.fullName}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default memo(Coach);
