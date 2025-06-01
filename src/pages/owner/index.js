import { memo, useMemo, useState, useEffect } from "react";
import { getUserInfo } from "../../utils/auth";
import "./style.scss";
import {
  fetchOwnerStats,
  fetchMostBookedCourtByOwner,
  fetchOwnerCourtsWithBookings,
  fetchBookingHistory,
  fetchTotalPriceByOwner,
} from "../../services/ownerService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import CircleStat from "./CircleStat";

const Owner = () => {
  const [filter, setFilter] = useState("Mới nhất");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingHistory, setBookingHistory] = useState([]);
  const [filteredBooking, setFilteredBooking] = useState([]);
  const [courts, setCourts] = useState([]);
  const [uniquePlayerCount, setUniquePlayerCount] = useState(0);
  const [totalCourtBookings, setTotalCourtBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [mostBookedCourt, setMostBookedCourt] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [totalPriceByOwner, setTotalPriceByOwner] = useState(0);

  const storedOwnerId = getUserInfo();
  const ownerId = storedOwnerId?.id || storedOwnerId?.userId;

  // Hàm lọc booking theo tháng hiện tại và tháng trước, tạo dữ liệu cho BarChart
  const getMonthlyBookingData = (bookings) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-based
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      name: `T${i + 1}`,
      thisMonth: 0,
      lastMonth: 0,
    }));

    bookings.forEach((booking) => {
      const date = new Date(booking.startTime);
      if (
        date.getFullYear() === currentYear &&
        date.getMonth() === currentMonth
      ) {
        monthlyData[currentMonth].thisMonth += 1;
      }
      if (
        date.getFullYear() === lastMonthYear &&
        date.getMonth() === lastMonth
      ) {
        monthlyData[lastMonth].lastMonth += 1;
      }
    });

    return monthlyData;
  };

  // 1. useEffect chỉ gọi API 1 lần khi ownerId thay đổi
  useEffect(() => {
    if (!ownerId) {
      console.warn("Owner ID not found");
      return;
    }

    fetchBookingHistory(1, 100)
      .then((data) => {
        setBookingHistory(data);

        // Tính doanh thu hôm nay và dữ liệu theo giờ
        const today = new Date();
        const todayStr = today.toDateString();

        const todayBookings = data.filter((booking) => {
          const start = new Date(booking.startTime);
          return start.toDateString() === todayStr;
        });

        const totalRevenueToday = todayBookings.reduce(
          (sum, booking) => sum + (booking.totalPrice || 0),
          0
        );
        setTodayRevenue(totalRevenueToday);

        const revenueByHour = {};

        todayBookings.forEach((booking) => {
          const start = new Date(booking.startTime);
          const hourKey = start.getHours().toString().padStart(2, "0") + ":00";

          if (!revenueByHour[hourKey]) {
            revenueByHour[hourKey] = { value: 0, courts: new Set() };
          }
          revenueByHour[hourKey].value += booking.totalPrice || 0;
          if (booking.court?.name) {
            revenueByHour[hourKey].courts.add(booking.court.name);
          }
        });

        // Chuyển sang mảng
        const hourlyDataArray = Object.entries(revenueByHour).map(
          ([time, data]) => ({
            time,
            value: data.value,
            courts: Array.from(data.courts),
          })
        );
        const sortedHourlyData = hourlyDataArray.sort((a, b) => {
          const toMinutes = (t) => {
            const [h, m] = t.split(":").map(Number);
            return h * 60 + m;
          };
          return toMinutes(a.time) - toMinutes(b.time);
        });
        setHourlyData(sortedHourlyData);
      })
      .catch(console.error);

    fetchTotalPriceByOwner(ownerId, "VNPay", 5, 2025)
      .then((total) => {
        if (total !== null && total !== undefined) {
          setTotalPriceByOwner(total);
        }
      })
      .catch(console.error);

    fetchOwnerCourtsWithBookings(ownerId).then(setCourts).catch(console.error);

    fetchOwnerStats(ownerId)
      .then((data) => {
        if (data) {
          setUniquePlayerCount(data.uniquePlayerCount);
          setTotalCourtBookings(data.totalCourtBookings);
          setTotalRevenue(data.totalRevenue);
        }
      })
      .catch(console.error);

    fetchMostBookedCourtByOwner(ownerId)
      .then(setMostBookedCourt)
      .catch(console.error);
  }, [ownerId]);

  // 2. useEffect xử lý lọc bookingHistory theo filter và searchTerm
  useEffect(() => {
    let filtered = [...bookingHistory];

    if (filter === "Mới nhất") {
      filtered.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    } else if (filter === "Cũ nhất") {
      filtered.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
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
      filtered = filtered.filter((booking) => {
        const start = new Date(booking.startTime);
        const end = new Date(booking.endTime);

        return (
          (booking.user?.fullName || "").toLowerCase().includes(lowerSearch) ||
          booking.id.toString().includes(lowerSearch) ||
          start.toLocaleDateString("vi-VN").includes(lowerSearch) ||
          `${start.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })} - ${end.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}`.includes(lowerSearch) ||
          (booking.court?.name || "").toLowerCase().includes(lowerSearch) ||
          (booking.totalPrice?.toString() || "").includes(lowerSearch) ||
          (booking.status || "").toLowerCase().includes(lowerSearch)
        );
      });
    }

    setFilteredBooking(filtered);
  }, [bookingHistory, filter, searchTerm]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const courts = Array.isArray(data.courts) ? data.courts : [];
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#fff",
            padding: 10,
            border: "1px solid #ccc",
          }}
        >
          <p>{`Giờ: ${label}`}</p>
          <p>{`Doanh thu: ${data.value.toLocaleString("vi-VN")} VNĐ`}</p>
          <p>{`Sân: ${courts.length > 0 ? courts.join(", ") : "Không có"}`}</p>
        </div>
      );
    }
    return null;
  };

  const bookingDataForChart = courts.map((court) => ({
    name: court.name,
    current: court.weeklyBookingCount || 0,
    previous: 0,
  }));

  const pieChartData = mostBookedCourt
    ? [
        {
          label: mostBookedCourt.court.name,
          value: mostBookedCourt.bookingCount,
          color: "#A3E635",
        },
      ]
    : [];

  const getMonthlyRevenue = (bookings) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return bookings.reduce((sum, booking) => {
      const start = new Date(booking.startTime);
      if (
        start.getFullYear() === currentYear &&
        start.getMonth() === currentMonth
      ) {
        return sum + (booking.totalPrice || 0);
      }
      return sum;
    }, 0);
  };

  const monthlyRevenue = useMemo(
    () => getMonthlyRevenue(bookingHistory),
    [bookingHistory]
  );
  const monthlyData = getMonthlyBookingData(bookingHistory);

  const targetPlayerCount = 1000; // Mục tiêu số người tiếp cận
  const targetCourtBookings = 500; // Mục tiêu tổng đơn đặt
  const targetRevenue = 10000000; // Mục tiêu doanh thu (10 triệu VNĐ)
  const playerPercentage = (uniquePlayerCount / targetPlayerCount) * 100;
  const courtBookingPercentage =
    (totalCourtBookings / targetCourtBookings) * 100;
  const revenuePercentage = (monthlyRevenue / targetRevenue) * 100;
  const dailyRevenuePercentage = (todayRevenue / targetRevenue) * 100;

  return (
    <div className="owner-page">
      <div className="stat-cards flex flex-wrap gap-6">
        <CircleStat
          title="Số người tiếp cận"
          value={uniquePlayerCount}
          percentage={Math.min(playerPercentage, 100)}
        />

        <CircleStat
          title="Tổng đơn đặt"
          value={totalCourtBookings}
          percentage={Math.min(courtBookingPercentage, 100)}
        />

        <CircleStat
          title="Doanh Thu Tháng"
          value={`${totalPriceByOwner.toLocaleString("vi-VN")} VNĐ`}
          percentage={Math.min(revenuePercentage, 100)}
        />

        <CircleStat
          title="Tổng Doanh thu "
          value={`${totalRevenue.toLocaleString("vi-VN")} VNĐ`}
          percentage={Math.min(dailyRevenuePercentage, 100)}
        />
      </div>

      <div className="charts">
        <div className="chart-box">
          <h3>Đơn đặt</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingDataForChart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="current" fill="#000" name="Tuần này" />
              <Bar dataKey="previous" fill="#A3E635" name="Tuần trước" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Doanh thu hôm nay</h3>
            <p className="text-2xl font-bold">
              <strong>{todayRevenue.toLocaleString("vi-VN")} VNĐ</strong>
            </p>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={
                hourlyData.length > 0
                  ? hourlyData
                  : [{ time: "00:00", value: 0, courts: [] }]
              }
            >
              <XAxis dataKey="time" stroke="#555" />
              <YAxis stroke="#555" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#82ca9d"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="month-chart-stats-container">
        <div className="monthly-bar-chart">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData} margin={{ top: 15 }}>
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 14, fill: "#333" }}
              />
              <YAxis />
              <Tooltip />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: 14 }}
                payload={[
                  { value: "Tháng trước", type: "circle", color: "#444" },
                  { value: "Tháng này", type: "circle", color: "#A3E635" },
                ]}
              />
              <Bar
                dataKey="lastMonth"
                fill="#444"
                barSize={15}
                radius={[10, 10, 0, 0]}
                name="Tháng trước"
              />
              <Bar
                dataKey="thisMonth"
                fill="#A3E635"
                barSize={15}
                radius={[10, 10, 0, 0]}
                name="Tháng này"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bottom-section">
          <div className="pie-chart-section">
            <h4>Sân đặt nhiều nhất</h4>

            {pieChartData.length > 0 && (
              <>
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx={70}
                      cy={70}
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="pie-legend">
                  {pieChartData.map(({ label, color, value }) => (
                    <div key={label} className="legend-item">
                      <span
                        className="color-box"
                        style={{ backgroundColor: color }}
                      />
                      <span>
                        {label}: {value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Bảng lịch sử đặt sân */}
          <div className="booking-history-section">
            <h4>Lịch sử đặt sân</h4>
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              aria-label="search booking"
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
            <div className="booking-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Mã đơn</th>
                    <th>Ngày</th>
                    <th>Thời gian</th>
                    <th>Sân</th>
                    <th>Thu nhập</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooking.map((booking) => {
                    const start = new Date(booking.startTime);
                    const end = new Date(booking.endTime);
                    return (
                      <tr key={booking.id}>
                        <td>{booking.user?.fullName || "N/A"}</td>
                        <td>{booking.id}</td>
                        <td>{start.toLocaleDateString("vi-VN")}</td>
                        <td>
                          {start.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {end.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td>{booking.court?.name || "N/A"}</td>
                        <td>
                          {booking.totalPrice?.toLocaleString("vi-VN")} VNĐ
                        </td>
                        <td>
                          <span
                            className={`status ${booking.status?.toLowerCase()}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Owner);
