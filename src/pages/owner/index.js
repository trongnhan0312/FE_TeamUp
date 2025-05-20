import { memo, useState } from "react";
import "./style.scss";
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
const statCards = [
  { title: "Số giờ thuê", value: 346 },
  { title: "Số người tiếp cận", value: 346 },
  { title: "Doanh thu hôm nay", value: 221 },
  { title: "Tổng doanh thu", value: "xx.000.000" },
];

const data = [
  { name: "Jan", current: 90, previous: 110 },
  { name: "Feb", current: 55, previous: 45 },
  { name: "Mar", current: 70, previous: 95 },
  { name: "Apr", current: 80, previous: 100 },
  { name: "May", current: 30, previous: 120 },
  { name: "Jun", current: 100, previous: 50 },
  { name: "Jul", current: 90, previous: 45 },
  { name: "Aug", current: 50, previous: 110 },
];
const hourlyData = [
  { time: "08:00", value: 20 },
  { time: "09:00", value: 30 },
  { time: "10:00", value: 40 },
  { time: "11:00", value: 25 },
  { time: "12:00", value: 35 },
  { time: "13:00", value: 50 },
  { time: "14:00", value: 20 },
];
const monthlyData = [
  { name: "T1", lastMonth: 70, thisMonth: 90 },
  { name: "T2", lastMonth: 50, thisMonth: 65 },
  { name: "T3", lastMonth: 30, thisMonth: 35 },
  { name: "T4", lastMonth: 40, thisMonth: 50 },
  { name: "T5", lastMonth: 20, thisMonth: 25 },
  { name: "T6", lastMonth: 60, thisMonth: 100 },
  { name: "T7", lastMonth: 80, thisMonth: 65 },
  { name: "T8", lastMonth: 60, thisMonth: 40 },
  { name: "T9", lastMonth: 30, thisMonth: 20 },
  { name: "T10", lastMonth: 20, thisMonth: 25 },
  { name: "T11", lastMonth: 40, thisMonth: 45 },
  { name: "T12", lastMonth: 90, thisMonth: 60 },
];
const bookingHistory = [
  {
    name: "Elena Watson",
    code: "QW-IN4789",
    date: "03/03/2025",
    time: "08:25 - 10:50",
    room: "Cửa 1",
    revenue: "248.000VNĐ",
    status: "Confirmed",
  },
  {
    name: "Elena Watson",
    code: "QW-IN4789",
    date: "03/03/2025",
    time: "08:25 - 10:50",
    room: "Cửa 1",
    revenue: "248.000VNĐ",
    status: "Pending",
  },
  {
    name: "Elena Watson",
    code: "QW-IN4789",
    date: "03/03/2025",
    time: "08:25 - 10:50",
    room: "Cửa 1",
    revenue: "248.000VNĐ",
    status: "Confirmed",
  },
  {
    name: "Elena Watson",
    code: "QW-IN4789",
    date: "03/03/2025",
    time: "08:25 - 10:50",
    room: "Cửa 1",
    revenue: "248.000VNĐ",
    status: "Confirmed",
  },
];
const productStats = [
  { label: "Đã hoàn thành", value: 55, color: "#A3E635" },
  { label: "Đang thực hiện", value: 30, color: "#e1d48e" },
  { label: "Có tỷ lệ", value: 20, color: "#bba184" },
  { label: "Chưa ọc", value: 15, color: "#7d7e79" },
];
const Owner = () => {
  const [filter, setFilter] = useState("Mới nhất");
  return (
    <div className="owner-page">
      <div className="stat-cards flex flex-wrap gap-6">
        <CircleStat title="Số giờ thuê" value={346} percentage={75} />
        <CircleStat title="Số người tiếp cận" value={346} percentage={75} />
        <CircleStat title="Doanh thu hôm nay" value={221} percentage={60} />
        <CircleStat title="Tổng doanh thu" value="xx.000.000" percentage={85} />
      </div>

      <div className="charts">
        <div className="chart-box">
          <h3>Đơn đặt</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="current" fill="#000" name="Tháng này" />
              <Bar dataKey="previous" fill="#A3E635" name="Tháng trước" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <div className="flex justify-between items-center mb-2">
            <div
              style={{
                display: "flex",
                flexWrap: "nowrap",
                justifyContent: "space-between",
              }}
            >
              <h3 className="text-lg font-semibold">Doanh thu hôm nay</h3>
            </div>
            <p className="text-2xl font-bold">
              <strong>2.000.000VNĐ</strong>
            </p>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={hourlyData}>
              <XAxis dataKey="time" stroke="#555" />
              <YAxis domain={[0, 60]} stroke="#555" />
              <Tooltip />
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
        {/* Biểu đồ tháng */}
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

        {/* Phần dưới: pie chart và bảng lịch sử */}
        <div className="bottom-section">
          {/* Pie chart */}
          <div className="pie-chart-section">
            <h4>Sản đặt nhiều nhất</h4>
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie
                  data={productStats}
                  cx={70}
                  cy={70}
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {productStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="pie-legend">
              {productStats.map(({ label, color, value }) => (
                <div key={label} className="legend-item">
                  <span
                    className="color-box"
                    style={{ backgroundColor: color }}
                  />
                  <span>
                    {label}: {value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bảng lịch sử đặt sân */}
          <div className="booking-history-section">
            <h4>Lịch sử đặt sân</h4>
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              aria-label="search booking"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="statusFilter"
            >
              <option>Mới nhất</option>
              <option>Cũ nhất</option>
              <option>Xác nhận</option>
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
                  {bookingHistory.map((row, i) => (
                    <tr key={i}>
                      <td>{row.name}</td>
                      <td>{row.code}</td>
                      <td>{row.date}</td>
                      <td>{row.time}</td>
                      <td>{row.room}</td>
                      <td>{row.revenue}</td>
                      <td>
                        <span className={`status ${row.status.toLowerCase()}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
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
