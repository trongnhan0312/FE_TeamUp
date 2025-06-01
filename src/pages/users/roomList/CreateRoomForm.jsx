import React, { useState, useEffect, memo } from "react";
import {
  FaCalendar,
  FaDollarSign,
  FaEnvelopeOpenText,
  FaMapPin,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./CreateRoomForm.scss";
import roomService from "../../../services/roomService";
import courtService from "../../../services/courtService"; // Import courtService
import { getUserInfo } from "../../../utils/auth";

const CreateRoomForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Bóng đá");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courtInfo, setCourtInfo] = useState(null); // State để lưu thông tin sân
  const [isLoadingCourt, setIsLoadingCourt] = useState(false); // Loading state

  // Initialize form data with data from navigation state if available
  const [formData, setFormData] = useState(() => {
    const { courtId, scheduledTime } = location.state || {};
    const initialScheduledTime = scheduledTime
      ? new Date(scheduledTime).toISOString()
      : new Date().toISOString();

    return {
      hostId: getUserInfo()?.id || 0,
      courtId: courtId || 0,
      name: "",
      maxPlayers: 20,
      description: "",
      roomFee: 100000,
      scheduledTime: initialScheduledTime,
    };
  });

  const tabs = ["Pickleball", "Bóng đá", "Cầu lông"];

  // Function to fetch court information
  const fetchCourtInfo = async (courtId) => {
    if (!courtId) return;
    
    setIsLoadingCourt(true);
    try {
      const response = await courtService.getById(courtId);
      setCourtInfo(response.resultObj);
    } catch (error) {
      console.error("Error fetching court info:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể lấy thông tin sân",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoadingCourt(false);
    }
  };

  // Fetch court info when component mounts or courtId changes
  useEffect(() => {
    if (formData.courtId) {
      fetchCourtInfo(formData.courtId);
    }
  }, [formData.courtId]);

  // Update selectedDate when scheduledTime changes from navigation
  useEffect(() => {
    if (location.state?.scheduledTime) {
      const newDate = new Date(location.state.scheduledTime);
      setSelectedDate(newDate);
      setCurrentMonth(newDate);
    }
  }, [location.state]);

  // Tạo ngày trong lịch tháng khi currentMonth thay đổi
  useEffect(() => {
    setCalendarDays(getCalendarDays(currentMonth));
  }, [currentMonth]);

  // Hàm lấy các ngày để hiển thị trên lịch tháng
  function getCalendarDays(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const days = [];

    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        currentMonth: true,
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
      });
    }

    return days;
  }

  // Kiểm tra xem một ngày có phải là ngày được chọn
  const isSelectedDate = (date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const currentDateStr = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(selectedDate);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // const formatDateTime = (dateTimeString) => {
  //   const date = new Date(dateTimeString);
  //   return date.toLocaleString("vi-VN");
  // };

  // const handleDateTimeChange = (field, value) => {
  //   if (field === "date") {
  //     const currentTime = new Date(formData.scheduledTime);
  //     const newDate = new Date(value);
  //     newDate.setHours(currentTime.getHours(), currentTime.getMinutes());
  //     handleInputChange("scheduledTime", newDate.toISOString());
  //   } else if (field === "time") {
  //     const currentDate = new Date(formData.scheduledTime);
  //     const [hours, minutes] = value.split(":");
  //     currentDate.setHours(parseInt(hours), parseInt(minutes));
  //     handleInputChange("scheduledTime", currentDate.toISOString());
  //   }
  // };

  const getCurrentDate = () => {
    const date = new Date(formData.scheduledTime);
    return date.toISOString().split("T")[0];
  };

  const getCurrentTime = () => {
    const date = new Date(formData.scheduledTime);
    return date.toTimeString().slice(0, 5);
  };

  // // Xử lý khi chọn ngày từ calendar
  // const handleCalendarDateSelect = (day) => {
  //   setSelectedDate(day.date);
  //   // Cập nhật scheduledTime với ngày mới được chọn
  //   const currentTime = new Date(formData.scheduledTime);
  //   const newDate = new Date(day.date);
  //   newDate.setHours(currentTime.getHours(), currentTime.getMinutes());
  //   handleInputChange("scheduledTime", newDate.toISOString());
  // };

  // Validate form data
  const validateForm = () => {
    if (!formData.name.trim()) {
      Swal.fire("Lỗi", "Vui lòng nhập tên phòng", "error");
      return false;
    }
    if (formData.maxPlayers < 1) {
      Swal.fire("Lỗi", "Số người chơi phải lớn hơn 0", "error");
      return false;
    }
    if (formData.roomFee < 0) {
      Swal.fire("Lỗi", "Phí tham gia không được âm", "error");
      return false;
    }
    if (!formData.courtId) {
      Swal.fire("Lỗi", "Vui lòng chọn sân", "error");
      return false;
    }
    const scheduledDate = new Date(formData.scheduledTime);
    const now = new Date();
    if (scheduledDate <= now) {
      Swal.fire("Lỗi", "Thời gian đặt phải sau thời điểm hiện tại", "error");
      return false;
    }
    return true;
  };

  // Format datetime for API
  const formatDateTimeForAPI = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // Handle room creation
  const handleCreateRoom = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Format scheduledTime before sending to API
      const formattedScheduledTime = formatDateTimeForAPI(formData.scheduledTime);
      
      const response = await roomService.create(
        formData.hostId,
        formData.courtId,
        formData.name,
        formData.maxPlayers,
        formData.description,
        formData.roomFee,
        formattedScheduledTime
      );

      await Swal.fire({
        title: "Thành công!",
        text: "Phòng đã được tạo thành công",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Navigate back to previous page or to rooms list
      navigate(-1); // Go back to previous page
      // Or navigate to a specific route: navigate('/rooms');
    } catch (error) {
      console.error("Error creating room:", error);

      let errorMessage = "Có lỗi xảy ra khi tạo phòng";
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error.errors && Array.isArray(error.errors)) {
        errorMessage = error.errors.join("\n");
      }

      Swal.fire({
        title: "Lỗi!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-room-form">
      {/* Header Tabs */}
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-button ${activeTab === tab ? "active" : ""} ${tab
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="form-layout">
        {/* Left Column - Form */}
        <div className="form-column">
          {/* Date Selection */}
          <div className="form-section">
            <div className="section-header">
              <FaCalendar className="icon" />
              <span className="section-title">Ngày và giờ</span>
            </div>

            <div className="datetime-inputs">
              <input
                readOnly
                type="date"
                value={getCurrentDate()}
                // onChange={(e) => handleDateTimeChange("date", e.target.value)}
                className="form-input date-input"
              />
              <input
                readOnly
                type="time"
                value={getCurrentTime()}
                // onChange={(e) => handleDateTimeChange("time", e.target.value)}
                className="form-input time-input"
              />
            </div>
          </div>

          {/* Location - Updated to use court info */}
          <div className="form-section">
            <div className="section-header">
              <FaMapPin className="icon" />
              <span className="section-title">Địa điểm</span>
            </div>
            <div className="location-info">
              {isLoadingCourt ? (
                <p>Đang tải thông tin sân...</p>
              ) : courtInfo ? (
                <>
                  <p>{courtInfo?.name || "Tên sân không có"}</p>
                  <p>{courtInfo?.sportsComplexModelView.address || "Địa chỉ không có"}</p>
                  {courtInfo.description && (
                    <p className="court-description">{courtInfo.description}</p>
                  )}
                  {courtInfo.pricePerHour && (
                    <p className="court-price">
                      Giá: {courtInfo.pricePerHour.toLocaleString("vi-VN")} VNĐ/giờ
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p>Sân cầu lông HAT</p>
                  <p>269 Nguyễn Thái Sơn Gò Vấp</p>
                  {formData.courtId && (
                    <p className="court-id">Court ID: {formData.courtId}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Max Players */}
          <div className="form-section">
            <div className="section-header">
              <FaUsers className="icon" />
              <span className="section-title">Số người chơi</span>
            </div>
            <div className="player-counter">
              <button
                onClick={() =>
                  handleInputChange(
                    "maxPlayers",
                    Math.max(1, formData.maxPlayers - 1)
                  )
                }
                className="counter-btn decrease"
                disabled={formData.maxPlayers <= 1}
              >
                -
              </button>
              <span className="counter-value">{formData.maxPlayers}</span>
              <button
                onClick={() =>
                  handleInputChange("maxPlayers", formData.maxPlayers + 1)
                }
                className="counter-btn increase"
              >
                +
              </button>
            </div>
          </div>

          {/* Room Name */}
          <div className="form-section">
            <div className="section-header">
              <FaEnvelopeOpenText className="icon" />
              <span className="section-title">Tên phòng</span>
            </div>
            <input
              type="text"
              placeholder="Nhập tên phòng"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="form-input text-input"
              required
            />
          </div>

          {/* Room Fee */}
          <div className="form-section">
            <div className="section-header">
              <FaDollarSign className="icon" />
              <span className="section-title">Phí tham gia</span>
            </div>
            <input
              type="text"
              placeholder="VNĐ/người"
              value={formData.roomFee.toLocaleString("vi-VN")}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, "");
                handleInputChange("roomFee", parseInt(value) || 0);
              }}
              className="form-input text-input"
            />
          </div>

          {/* Description */}
          <div className="form-section">
            <div className="section-header">
              <FaEnvelopeOpenText className="icon" />
              <span className="section-title">Mô tả</span>
            </div>
            <textarea
              placeholder="Nhập mô tả phòng"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="form-input textarea-input"
            />
          </div>
        </div>

        {/* Right Column - Calendar */}
        <div className="calendar-panel">
          <div className="month-header">
            <h2>Tháng {currentMonth.getMonth() + 1}</h2>
            <p>{currentDateStr}</p>
          </div>

          <div className="month-calendar">
            <div className="weekday-row">
              <div className="weekday-cell">CN</div>
              <div className="weekday-cell">T2</div>
              <div className="weekday-cell">T3</div>
              <div className="weekday-cell">T4</div>
              <div className="weekday-cell">T5</div>
              <div className="weekday-cell">T6</div>
              <div className="weekday-cell">T7</div>
            </div>

            <div className="calendar-days">
              {calendarDays.map((day, index) => (
                <div
                  key={`day-${index}`}
                  className={`calendar-day ${
                    !day.currentMonth ? "other-month" : ""
                  } ${day.isToday ? "today" : ""} ${
                    isSelectedDate(day.date) ? "selected" : ""
                  }`}
                  // onClick={() => handleCalendarDateSelect(day)}
                >
                  {day.date.getDate()}
                </div>
              ))}
            </div>
          </div>

          <button
            className="create-room-btn"
            onClick={handleCreateRoom}
            disabled={isSubmitting || !formData.name.trim() || isLoadingCourt}
          >
            {isSubmitting ? "Đang tạo..." : "Tạo phòng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(CreateRoomForm);