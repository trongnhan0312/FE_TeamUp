import { memo, useState, useEffect } from "react";
import "./style.scss";
import CircleStat from "../CircleStat";
import {
  fetchOwnerStats,
  fetchMostBookedCourtByOwner,
  fetchOwnerCourtsWithBookings,
  fetchBookingHistory,
} from "../../../services/ownerService"; // import service
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend,
} from "recharts";
import { BsPencil } from "react-icons/bs";
import "./style.scss";

const pieData = [
  { name: "Đặt sân", value: 346 },
  { name: "Còn lại", value: 100 - 346 }, // Giả sử tỷ lệ 100%
];

const pieColors = ["#91d931", "#e6e6e6"];

const barData = [
  { name: "Jan", thisMonth: 80, lastMonth: 100 },
  { name: "Feb", thisMonth: 40, lastMonth: 50 },
  { name: "Mar", thisMonth: 70, lastMonth: 65 },
  { name: "Apr", thisMonth: 100, lastMonth: 80 },
  { name: "May", thisMonth: 40, lastMonth: 70 },
  { name: "Jun", thisMonth: 60, lastMonth: 50 },
  { name: "Jul", thisMonth: 100, lastMonth: 80 },
  { name: "Aug", thisMonth: 50, lastMonth: 60 },
  { name: "Sep", thisMonth: 70, lastMonth: 55 },
  { name: "Oct", thisMonth: 90, lastMonth: 65 },
  { name: "Nov", thisMonth: 100, lastMonth: 80 },
  { name: "Dec", thisMonth: 80, lastMonth: 50 },
];

const customerGroups = [
  {
    name: "Văn tèo",
    criteria: "30+ ngày chưa đặt sân",
    offer: "Mã giảm giá đặc biệt để quay lại",
  },
  {
    name: "Văn tèo",
    criteria: "Khách đặt sân giờ thấp điểm",
    offer: "Giảm giá 40%",
  },
  {
    name: "Văn tèo",
    criteria: "Khách đặt nhiều lần/tháng",
    offer: "Tặng 1 buổi miễn phí sau X lần",
  },
];

const players = [
  {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/40?img=1",
    lastBooking: "05/03/2025",
    bookingCount: 10,
    habit: "Tối T6, CN",
  },
  {
    name: "Alex Ray",
    avatar: "https://i.pravatar.cc/40?img=2",
    lastBooking: "02/03/2026",
    bookingCount: 5,
    habit: "Sáng T7",
  },
  {
    name: "Kate Hunington",
    avatar: "https://i.pravatar.cc/40?img=3",
    lastBooking: "07/03/2025",
    bookingCount: 7,
    habit: "Tối T5",
  },
];

const HumanHabits = () => {
  const [uniquePlayerCount, setUniquePlayerCount] = useState(0);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const storedOwnerId = localStorage.getItem("ownerId");
    if (!storedOwnerId) {
      console.warn("Owner ID not found");
      return;
    }

    fetchOwnerStats(storedOwnerId)
      .then((data) => {
        if (data) {
          setUniquePlayerCount(data.uniquePlayerCount);
        }
      })
      .catch(console.error);

    fetchBookingHistory(1, 100)
      .then((bookings) => {
        // Nhóm booking theo người chơi
        const playerMap = new Map();

        bookings.forEach((b) => {
          const userId = b.user?.id;
          if (!userId) return;

          const existing = playerMap.get(userId) || {
            id: userId,
            name: b.user.fullName || "N/A",
            avatar: b.user.avatarUrl || `https://i.pravatar.cc/40?u=${userId}`, // fallback avatar
            lastBooking: null,
            bookingCount: 0,
            habit: "",
          };

          existing.bookingCount++;
          const bookingDate = new Date(b.startTime);
          if (
            !existing.lastBooking ||
            bookingDate > new Date(existing.lastBooking)
          ) {
            existing.lastBooking = bookingDate.toLocaleDateString("vi-VN");
          }

          // Đơn giản: tạm lấy thói quen theo ngày đặt (vd: sáng/chiều/tối)
          const hour = bookingDate.getHours();
          if (hour < 12) existing.habit = "Sáng";
          else if (hour < 18) existing.habit = "Chiều";
          else existing.habit = "Tối";

          playerMap.set(userId, existing);
        });

        // Chuyển Map thành mảng và sắp xếp theo bookingCount giảm dần
        const playerList = Array.from(playerMap.values()).sort(
          (a, b) => b.bookingCount - a.bookingCount
        );

        setPlayers(playerList);
      })
      .catch(console.error);
  }, []);
  return (
    <div className="humanhabits-container">
      <div className="summary-cards">
        <div className="card">
          <CircleStat
            title="Tổng số người đặt sân"
            value={uniquePlayerCount}
            percentage={75}
          />
        </div>
        <div className="card">
          <CircleStat
            title="Tỷ lệ khách quay lại"
            value={346}
            percentage={75}
          />
        </div>
      </div>

      <div className="main-content">
        <div className="left-section">
          <div className="bar-chart-card">
            <h3>Xu hướng đặt sân</h3>
            <div className="legend">
              <span className="dot green" /> Tháng này
              <span className="dot purple" /> Tháng trước
            </div>
            <div className="time-filters">
              <button className="filter-btn">Tuần</button>
              <button className="filter-btn">Tháng</button>
              <button className="filter-btn active">Năm</button>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData} barCategoryGap={8}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="thisMonth" fill="#000" />
                <Bar dataKey="lastMonth" fill="#91d931 " />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="right-section">
          <table className="customer-groups-table">
            <thead>
              <tr>
                <th>Nhóm khách hàng</th>
                <th>Tiêu Chí</th>
                <th>Ưu Đãi Đề Xuất</th>
              </tr>
            </thead>
            <tbody>
              {customerGroups.map((g, i) => (
                <tr key={i}>
                  <td className="group-name">
                    <img
                      src="https://i.pravatar.cc/40?img=10"
                      alt={g.name}
                      className="group-avatar"
                    />
                    {g.name}
                  </td>
                  <td>{g.criteria}</td>
                  <td>{g.offer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <table className="players-table">
        <thead>
          <tr>
            <th>Người chơi</th>
            <th>Lần đặt gần nhất</th>
            <th>Số lần đặt</th>
            <th>Thói quen</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr key={p.id || i}>
              <td className="player-name">
                <img src={p.avatar} alt={p.name} />
                {p.name}
              </td>
              <td>{p.lastBooking}</td>
              <td>{String(p.bookingCount).padStart(2, "0")}</td>
              <td>{p.habit}</td>
              <td className="action-edit">
                <button>
                  <BsPencil />
                  <span>EDIT</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(HumanHabits);
