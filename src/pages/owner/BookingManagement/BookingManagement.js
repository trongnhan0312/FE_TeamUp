import { memo, useState } from "react";
import "./style.scss";
const days = ["Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
const dates = [2, 3, 4, 5, 6, 7];
const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];
const BookingManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const today = new Date(2025, 2, 15); // March 15, 2025

  return (
    <div className="booking-management">
      <div className="tabs">
        {["Sân 1", "Sân 1", "Sân 1"].map((tab, i) => (
          <button
            key={i}
            className={`tab-item ${activeTab === i ? "active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="content">
        {/* Left Schedule */}
        <div className="schedule">
          <div className="header-row">
            <div className="time-column-header"></div>
            {days.map((day, i) => (
              <div key={i} className="day-column-header">
                <div>{day}</div>
                <div className="date">{dates[i]}</div>
              </div>
            ))}
          </div>

          <div className="time-column">
            {hours.map((h, i) => (
              <div key={i} className="time-cell">
                {h}
              </div>
            ))}
          </div>

          <div className="grid">
            {/* Create 6 columns for days */}
            {days.map((_, colIdx) => (
              <div key={colIdx} className="day-column">
                {hours.map((_, rowIdx) => {
                  // Example: highlight Tuesday 09:00-10:00 block
                  const isActive = colIdx === 1 && rowIdx === 0; // Tuesday index 1, hour index 0 = 09:00

                  return (
                    <div
                      key={rowIdx}
                      className={`grid-cell ${isActive ? "active-block" : ""}`}
                    ></div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right Calendar */}
        <div className="calendar">
          <div className="month-title">
            <div className="month-name">Tháng 3</div>
            <div className="date-description">Thứ 3, ngày 15 tháng 3, 2025</div>
          </div>

          <div className="calendar-box">
            <div className="nav-arrow left">{"<"}</div>
            <div className="calendar-inner">
              <div className="calendar-header">Tháng 3 2025</div>
              <div className="calendar-dates">
                {[
                  27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
                  15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
                  30, 31, 32, 2, 3, 4, 5, 6, 7,
                ].map((d, idx) => (
                  <div key={idx} className="calendar-date">
                    {d}
                  </div>
                ))}
              </div>
            </div>
            <div className="nav-arrow right">{">"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(BookingManagement);
