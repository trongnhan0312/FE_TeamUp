import { useState } from "react";
import "./Calendar.scss";

const Calendar = ({ onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = [];
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Hàm kiểm tra ngày có nằm trong quá khứ không
  const isPastDate = (day) => {
    if (!day) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    return dayDate < today;
  };

  const handleDateClick = (day) => {
    if (!day) return;
    if (isPastDate(day)) return; // không cho chọn ngày quá khứ

    const clickedDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    day,
    12, 0, 0
  );

    onDateSelect(clickedDate);
  };

  const isSelectedDate = (day) => {
    if (!day || !selectedDate) return false;

    const dayDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return (
      dayDate.getDate() === selectedDate.getDate() &&
      dayDate.getMonth() === selectedDate.getMonth() &&
      dayDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isToday = (day) => {
    if (!day) return false;

    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth} className="nav-btn">
          ‹
        </button>
        <span className="month-year">
          Tháng {currentDate.getMonth() + 1} {currentDate.getFullYear()}
        </span>
        <button onClick={nextMonth} className="nav-btn">
          ›
        </button>
      </div>

      <div className="calendar-grid">
        {dayNames.map((day) => (
          <div key={day} className="day-name">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const isDisabled = isPastDate(day);
          return (
            <div
              key={index}
              className={`calendar-day ${
                day ? "active" : "empty"
              } ${isSelectedDate(day) ? "selected" : ""} ${
                isToday(day) ? "today" : ""
              } ${isDisabled ? "disabled" : ""}`}
              onClick={() => handleDateClick(day)}
              style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
              aria-disabled={isDisabled}
              tabIndex={isDisabled ? -1 : 0}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isDisabled) handleDateClick(day);
              }}
            >
              {day}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="selected-date-info">
          <span>Ngày đã chọn: {selectedDate.toLocaleDateString("vi-VN")}</span>
          <button className="clear-date-btn" onClick={() => onDateSelect(null)}>
            Xóa
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
