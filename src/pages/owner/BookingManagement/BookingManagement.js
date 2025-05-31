"use client";

import { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import "./style.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  fetchSportsComplexesByOwner,
  fetchCourtsBySportsComplexId,
} from "../../../services/ownerService";
import courtService from "../../../services/courtService";

const BookingManagement = () => {
  const { courtId } = useParams();
  const location = useLocation();
  const isMultiBooking = location.state?.isMultiBooking;
  const coachId = location.state?.coachId;

  const [sportsComplexes, setSportsComplexes] = useState([]);
  const [loadingComplexes, setLoadingComplexes] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getWeekDays(new Date()));
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [expandedAreas, setExpandedAreas] = useState({});
  const [selectedCourtId, setSelectedCourtId] = useState(courtId || null);

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [bookingDuration, setBookingDuration] = useState(0);

  const [selectedBookings, setSelectedBookings] = useState([]);
  const [currentSelection, setCurrentSelection] = useState({
    startTime: null,
    endTime: null,
    selectedDay: null,
  });

  const [loadingCourts, setLoadingCourts] = useState({});

  useEffect(() => {
    setCalendarDays(getCalendarDays(currentMonth));
  }, [currentMonth]);

  useEffect(() => {
    // Chỉ fetch khi có selectedCourtId hợp lệ
    if (!selectedCourtId) {
      console.log("Chưa có sân được chọn, bỏ qua việc fetch schedule");
      setScheduleData([]);
      setError(null);
      return;
    }

    const fetchScheduleData = async () => {
      setLoading(true);
      setError(null);

      const today = new Date();
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();

      const todayStart = new Date(today);
      todayStart.setHours(0, 0, 0, 0);

      let startDateObj = new Date(currentWeek[0]);

      if (startDateObj < todayStart) {
        startDateObj = new Date(todayStart);
      }

      let formattedStartDate;

      const isToday =
        startDateObj.getDate() === today.getDate() &&
        startDateObj.getMonth() === today.getMonth() &&
        startDateObj.getFullYear() === today.getFullYear();

      if (isToday) {
        formattedStartDate = formatDateForApi(
          startDateObj,
          currentHour,
          currentMinute
        );
      } else {
        formattedStartDate = formatDateForApi(startDateObj, 0, 0);
      }

      console.log(
        "Gọi API với courtId:",
        selectedCourtId,
        "và ngày giờ:",
        formattedStartDate
      );

      try {
        const data = await courtService.getFreeHours(
          selectedCourtId,
          formattedStartDate
        );

        if (data.isSuccessed) {
          setScheduleData(data.resultObj || []);
        } else {
          setError(data.message || "Không thể lấy dữ liệu lịch");
          console.error("API trả về lỗi:", data.message);
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu lịch");
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, [selectedCourtId, currentWeek]);

  useEffect(() => {
    const storedOwnerId = localStorage.getItem("ownerId");

    if (!storedOwnerId) {
      console.warn("Không tìm thấy ownerId trong localStorage");
      setError("Không tìm thấy thông tin chủ sân. Vui lòng đăng nhập lại.");
      return;
    }

    console.log("Fetching sports complexes for ownerId:", storedOwnerId);
    setLoadingComplexes(true);

    fetchSportsComplexesByOwner(storedOwnerId)
      .then((data) => {
        console.log("Sports complexes data received:", data);

        if (!data || data.length === 0) {
          console.warn("No sports complexes found for owner");
          setSportsComplexes([]);
          return;
        }

        const transformedData = data.map((complex) => ({
          id: complex.id,
          name: complex.name,
          type: complex.type,
          imageUrls: complex.imageUrls,
          courts: [], // Sẽ được load khi user click
        }));

        console.log("Transformed sports complexes:", transformedData);
        setSportsComplexes(transformedData);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy khu thể thao:", err);

        // Kiểm tra loại lỗi cụ thể
        if (err.response?.status === 404) {
          setError(
            "Không tìm thấy thông tin chủ sân. Vui lòng kiểm tra lại tài khoản."
          );
        } else if (err.response?.status === 401) {
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          setError(
            "Không thể tải danh sách khu thể thao. Vui lòng thử lại sau."
          );
        }

        setSportsComplexes([]);
      })
      .finally(() => setLoadingComplexes(false));
  }, []);

  // Auto-select first court when sports complexes are loaded
  useEffect(() => {
    if (sportsComplexes.length > 0 && !selectedCourtId) {
      // Tự động mở dropdown đầu tiên và load courts
      const firstComplex = sportsComplexes[0];
      console.log("Auto-expanding first complex:", firstComplex.name);

      setExpandedAreas((prev) => ({
        ...prev,
        [firstComplex.id]: true,
      }));

      // Load courts cho complex đầu tiên
      loadCourtsForComplex(firstComplex.id);
    }
  }, [sportsComplexes, selectedCourtId]);

  // Function để load courts khi user click vào area
  const loadCourtsForComplex = async (complexId) => {
    if (loadingCourts[complexId]) return; // Đang load rồi thì không load lại

    // Kiểm tra xem đã load courts chưa
    const complex = sportsComplexes.find((c) => c.id === complexId);
    if (complex && complex.courts.length > 0) return; // Đã có courts rồi

    console.log("Loading courts for complex:", complexId);
    setLoadingCourts((prev) => ({ ...prev, [complexId]: true }));

    try {
      const courtsData = await fetchCourtsBySportsComplexId(complexId);
      console.log(
        "Courts data received for complex",
        complexId,
        ":",
        courtsData
      );

      if (!courtsData || courtsData.length === 0) {
        console.warn("No courts found for complex:", complexId);
        // Vẫn update để đánh dấu đã load, tránh load lại
        setSportsComplexes((prev) =>
          prev.map((complex) =>
            complex.id === complexId ? { ...complex, courts: [] } : complex
          )
        );
        return;
      }

      // Transform courts data để phù hợp với structure
      const transformedCourts = courtsData.map((court) => ({
        id: court.id,
        name: court.name,
        pricePerHour: court.pricePerHour,
        imageUrls: court.imageUrls,
      }));

      console.log(
        "Transformed courts for complex",
        complexId,
        ":",
        transformedCourts
      );

      // Update sports complexes với courts data
      setSportsComplexes((prev) =>
        prev.map((complex) => {
          if (complex.id === complexId) {
            const updatedComplex = { ...complex, courts: transformedCourts };

            // Auto-select first court if no court is currently selected
            if (!selectedCourtId && transformedCourts.length > 0) {
              setSelectedCourtId(transformedCourts[0].id);
            }

            return updatedComplex;
          }
          return complex;
        })
      );
    } catch (error) {
      console.error(`Lỗi khi lấy sân cho khu thể thao ${complexId}:`, error);

      // Đánh dấu đã thử load để tránh load lại liên tục
      setSportsComplexes((prev) =>
        prev.map((complex) =>
          complex.id === complexId ? { ...complex, courts: [] } : complex
        )
      );
    } finally {
      setLoadingCourts((prev) => ({ ...prev, [complexId]: false }));
    }
  };

  const toggleAreaExpanded = async (areaId) => {
    const isCurrentlyExpanded = expandedAreas[areaId];

    setExpandedAreas((prev) => ({
      ...prev,
      [areaId]: !prev[areaId],
    }));

    // Load courts khi mở dropdown lần đầu
    if (!isCurrentlyExpanded) {
      await loadCourtsForComplex(areaId);
    }
  };

  const handleCourtSelect = (courtId) => {
    setSelectedCourtId(courtId);
    setStartTime(null);
    setEndTime(null);
    setSelectedDay(null);
    setBookingDuration(0);
    setSelectedBookings([]);
    setCurrentSelection({
      startTime: null,
      endTime: null,
      selectedDay: null,
    });
  };

  const getCurrentCourtName = () => {
    for (const complex of sportsComplexes) {
      if (complex.courts) {
        const court = complex.courts.find((c) => c.id === selectedCourtId);
        if (court) {
          return `${complex.name} - ${court.name}`;
        }
      }
    }
    return "Sân không xác định";
  };

  const formatDateForApi = (date, hour = 0, minute = 0) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedHour = String(hour).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");

    return `${year}-${month}-${day} ${formattedHour}:${formattedMinute}`;
  };

  function getWeekDays(date) {
    const days = [];
    const currentDay = new Date(date);
    const firstDayOfWeek = new Date(
      currentDay.setDate(currentDay.getDate() - currentDay.getDay() + 1)
    );

    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      days.push(day);
    }

    return days;
  }

  function getCalendarDays(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const days = [];

    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      days.push({
        date: dateObj,
        currentMonth: true,
        isToday:
          dateObj.getDate() === today.getDate() &&
          dateObj.getMonth() === today.getMonth() &&
          dateObj.getFullYear() === today.getFullYear(),
      });
    }

    return days;
  }

  function getTimeSlots() {
    const slots = [];
    for (let i = 5; i <= 23; i++) {
      const hour = i.toString().padStart(2, "0");
      slots.push(`${hour}:00`);
    }
    return slots;
  }

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);

    const today = new Date();
    today.setDate(1);
    today.setHours(0, 0, 0, 0);

    if (prevMonth >= today) {
      setCurrentMonth(prevMonth);
    }
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const handlePrevWeek = () => {
    const prevWeekDate = new Date(currentWeek[0]);
    prevWeekDate.setDate(prevWeekDate.getDate() - 7);
    setCurrentWeek(getWeekDays(prevWeekDate));
  };

  const handleNextWeek = () => {
    const nextWeekDate = new Date(currentWeek[0]);
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    setCurrentWeek(getWeekDays(nextWeekDate));
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    }).format(date);
  };

  const isSelectedDate = (date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const dateToString = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const currentDateStr = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(selectedDate);

  const timeSlots = getTimeSlots();

  const handleSingleBookingSlot = (date, time) => {
    if (!isSlotAvailable(date, time)) {
      return;
    }

    if (!startTime || (startTime && endTime)) {
      setStartTime(time);
      setEndTime(null);
      setSelectedDay(date);
      setBookingDuration(0);
    } else if (startTime && !endTime) {
      const isSameDay = dateToString(selectedDay) === dateToString(date);
      const startHour = Number.parseInt(startTime.split(":")[0]);
      const selectedHour = Number.parseInt(time.split(":")[0]);

      if (isSameDay && selectedHour > startHour) {
        const allSlotsAvailable = checkAllSlotsAvailable(
          date,
          startHour,
          selectedHour
        );

        if (allSlotsAvailable) {
          setEndTime(time);
          setBookingDuration(selectedHour - startHour);
        } else {
          alert(
            "Không thể chọn khoảng thời gian này vì có slot đã được đặt ở giữa."
          );
        }
      } else {
        setStartTime(time);
        setEndTime(null);
        setSelectedDay(date);
        setBookingDuration(0);
      }
    }
  };

  const handleMultiBookingSlot = (date, time) => {
    if (!isSlotAvailable(date, time)) {
      return;
    }

    const isAlreadySelected = selectedBookings.some(
      (booking) =>
        dateToString(booking.selectedDay) === dateToString(date) &&
        isTimeInRange(time, booking.startTime, booking.endTime)
    );

    if (isAlreadySelected) {
      alert("Khung giờ này đã được chọn trong một booking khác!");
      return;
    }

    if (
      !currentSelection.startTime ||
      (currentSelection.startTime && currentSelection.endTime)
    ) {
      setCurrentSelection({
        startTime: time,
        endTime: null,
        selectedDay: date,
      });
    } else if (currentSelection.startTime && !currentSelection.endTime) {
      const isSameDay =
        dateToString(currentSelection.selectedDay) === dateToString(date);
      const startHour = Number.parseInt(
        currentSelection.startTime.split(":")[0]
      );
      const selectedHour = Number.parseInt(time.split(":")[0]);

      if (isSameDay && selectedHour > startHour) {
        const allSlotsAvailable = checkAllSlotsAvailable(
          date,
          startHour,
          selectedHour
        );

        if (allSlotsAvailable) {
          const hasConflict = selectedBookings.some(
            (booking) =>
              dateToString(booking.selectedDay) === dateToString(date) &&
              hasTimeOverlap(
                currentSelection.startTime,
                time,
                booking.startTime,
                booking.endTime
              )
          );

          if (hasConflict) {
            alert("Khoảng thời gian này xung đột với booking đã chọn!");
            return;
          }

          const newBooking = {
            startTime: currentSelection.startTime,
            endTime: time,
            selectedDay: date,
            duration: selectedHour - startHour,
            id: Date.now(),
          };

          setSelectedBookings((prev) => [...prev, newBooking]);
          setCurrentSelection({
            startTime: null,
            endTime: null,
            selectedDay: null,
          });
        } else {
          alert(
            "Không thể chọn khoảng thời gian này vì có slot đã được đặt ở giữa."
          );
        }
      } else {
        setCurrentSelection({
          startTime: time,
          endTime: null,
          selectedDay: date,
        });
      }
    }
  };

  const handleSlotClick = (date, time) => {
    if (isMultiBooking) {
      handleMultiBookingSlot(date, time);
    } else {
      handleSingleBookingSlot(date, time);
    }
  };

  const isTimeInRange = (time, startTime, endTime) => {
    const timeHour = Number.parseInt(time.split(":")[0]);
    const startHour = Number.parseInt(startTime.split(":")[0]);
    const endHour = Number.parseInt(endTime.split(":")[0]);
    return timeHour >= startHour && timeHour < endHour;
  };

  const hasTimeOverlap = (start1, end1, start2, end2) => {
    const start1Hour = Number.parseInt(start1.split(":")[0]);
    const end1Hour = Number.parseInt(end1.split(":")[0]);
    const start2Hour = Number.parseInt(start2.split(":")[0]);
    const end2Hour = Number.parseInt(end2.split(":")[0]);

    return !(end1Hour <= start2Hour || end2Hour <= start1Hour);
  };

  const removeBooking = (bookingId) => {
    setSelectedBookings((prev) =>
      prev.filter((booking) => booking.id !== bookingId)
    );
  };

  const resetCurrentSelection = () => {
    setCurrentSelection({
      startTime: null,
      endTime: null,
      selectedDay: null,
    });
  };

  const checkAllSlotsAvailable = (date, startHour, endHour) => {
    const checkHours = [];
    for (let hour = startHour + 1; hour < endHour; hour++) {
      checkHours.push(`${hour.toString().padStart(2, "0")}:00`);
    }

    return checkHours.every((time) => isSlotAvailable(date, time));
  };

  const isSlotAvailable = (date, time) => {
    const dateStr = dateToString(date);
    const dayData = scheduleData.find((day) => day.date === dateStr);

    if (!dayData || !dayData.freeSlots) return false;

    return dayData.freeSlots.some((slot) => {
      const slotStartHour = Number.parseInt(slot.startTime.split(":")[0]);
      const slotEndHour = Number.parseInt(slot.endTime.split(":")[0]);
      const timeHour = Number.parseInt(time.split(":")[0]);

      return slotStartHour <= timeHour && timeHour < slotEndHour;
    });
  };

  const isStartTimeSlot = (date, time) => {
    if (isMultiBooking) {
      return (
        currentSelection.startTime === time &&
        currentSelection.selectedDay &&
        dateToString(date) === dateToString(currentSelection.selectedDay)
      );
    }
    return (
      startTime === time &&
      selectedDay &&
      dateToString(date) === dateToString(selectedDay)
    );
  };

  const isEndTimeSlot = (date, time) => {
    if (isMultiBooking) {
      return (
        currentSelection.endTime === time &&
        currentSelection.selectedDay &&
        dateToString(date) === dateToString(currentSelection.selectedDay)
      );
    }
    return (
      endTime === time &&
      selectedDay &&
      dateToString(date) === dateToString(selectedDay)
    );
  };

  const isInSelectedRange = (date, time) => {
    if (isMultiBooking) {
      if (
        currentSelection.startTime &&
        currentSelection.selectedDay &&
        dateToString(date) === dateToString(currentSelection.selectedDay)
      ) {
        const timeHour = Number.parseInt(time.split(":")[0]);
        const startHour = Number.parseInt(
          currentSelection.startTime.split(":")[0]
        );

        if (currentSelection.endTime) {
          const endHour = Number.parseInt(
            currentSelection.endTime.split(":")[0]
          );
          return timeHour > startHour && timeHour < endHour;
        }
      }

      return selectedBookings.some(
        (booking) =>
          dateToString(booking.selectedDay) === dateToString(date) &&
          isTimeInRange(time, booking.startTime, booking.endTime)
      );
    }

    if (
      !startTime ||
      !selectedDay ||
      dateToString(date) !== dateToString(selectedDay)
    ) {
      return false;
    }

    const timeHour = Number.parseInt(time.split(":")[0]);
    const startHour = Number.parseInt(startTime.split(":")[0]);

    if (!endTime) {
      return false;
    }

    const endHour = Number.parseInt(endTime.split(":")[0]);
    return timeHour > startHour && timeHour < endHour;
  };

  const isSelectedBookingSlot = (date, time, type) => {
    if (!isMultiBooking) return false;

    return selectedBookings.some(
      (booking) =>
        dateToString(booking.selectedDay) === dateToString(date) &&
        booking[type === "start" ? "startTime" : "endTime"] === time
    );
  };

  const handleCheckout = () => {
    if (isMultiBooking) {
      if (selectedBookings.length === 0) return;

      const bookingData = {
        courtId: selectedCourtId,
        coachId,
        bookings: selectedBookings.map((booking) => ({
          date: dateToString(booking.selectedDay),
          startTime: booking.startTime,
          endTime: booking.endTime,
          duration: booking.duration,
        })),
        totalBookings: selectedBookings.length,
        totalDuration: selectedBookings.reduce(
          (sum, booking) => sum + booking.duration,
          0
        ),
      };

      navigate("/booking-confirmation", {
        state: { bookingData, isMultiBooking },
      });
    } else {
      if (!startTime || !endTime || !selectedDay) return;

      const bookingData = {
        courtId: selectedCourtId,
        date: dateToString(selectedDay),
        startTime,
        endTime,
        duration: bookingDuration,
      };

      navigate("/booking-confirmation", {
        state: { bookingData, isMultiBooking },
      });
    }
  };

  if (loading && scheduleData.length === 0) {
    return <div className="loading-indicator">Đang tải lịch đặt sân...</div>;
  }

  const formatDisplayTime = (time) => {
    if (!time) return "";
    return time;
  };

  return (
    <div className="booking-management-wrapper">
      <div className="sidebar-menu">
        <div className="sidebar-title">Chọn Sân Thể Thao</div>

        {loadingComplexes ? (
          <div className="loading-complexes">Đang tải khu thể thao...</div>
        ) : error ? (
          <div className="error-complexes">
            <p>{error}</p>
            <button
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </button>
          </div>
        ) : sportsComplexes.length === 0 ? (
          <div className="no-complexes">Không có khu thể thao nào</div>
        ) : (
          sportsComplexes.map((complex) => (
            <div key={complex.id} className="area-section">
              <div
                className="area-header"
                onClick={() => toggleAreaExpanded(complex.id)}
              >
                <span className="area-name">{complex.name}</span>
                <span className="area-type">({complex.type})</span>
                <span className="area-toggle">
                  {expandedAreas[complex.id] ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </span>
              </div>

              {expandedAreas[complex.id] && (
                <ul className="court-list">
                  {loadingCourts[complex.id] ? (
                    <li className="loading-courts">Đang tải sân...</li>
                  ) : complex.courts && complex.courts.length > 0 ? (
                    complex.courts.map((court) => (
                      <li
                        key={court.id}
                        className={`court-item ${
                          selectedCourtId === court.id ? "active" : ""
                        }`}
                        onClick={() => handleCourtSelect(court.id)}
                      >
                        <div className="court-info">
                          <span className="court-name">{court.name}</span>
                          <span className="court-price">
                            {court.pricePerHour?.toLocaleString("vi-VN")} VND/h
                          </span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="no-courts">Chưa có sân nào</li>
                  )}
                </ul>
              )}
            </div>
          ))
        )}
      </div>

      <div className="booking-main-content">
        <div className="current-court-info">
          <h2>{getCurrentCourtName()}</h2>
        </div>

        <div className="court-schedule">
          {selectedCourtId ? (
            <div className="schedule-container">
              <div className="schedule-header">
                <div className="week-selector">
                  <div className="date-range">
                    {formatDate(currentWeek[0])} - {formatDate(currentWeek[6])}{" "}
                    tháng {currentWeek[0].getMonth() + 1}
                  </div>
                  <div className="week-nav">
                    <button className="nav-button" onClick={handlePrevWeek}>
                      <FaChevronLeft />
                    </button>
                    <button className="nav-button" onClick={handleNextWeek}>
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="schedule-grid">
                <div className="time-column">
                  <div className="column-header"></div>
                  {timeSlots.map((time, index) => (
                    <div key={`time-${index}`} className="time-cell">
                      {time}
                    </div>
                  ))}
                </div>
                {currentWeek.map((date, dateIndex) => {
                  const dayName = [
                    "Hai",
                    "Ba",
                    "Tư",
                    "Năm",
                    "Sáu",
                    "Bảy",
                    "CN",
                  ][dateIndex];
                  const dayNum = date.getDate();

                  return (
                    <div key={`date-${dateIndex}`} className="day-column">
                      <div className="column-header">
                        <div className="day-name">{`T.${dayName}`}</div>
                        <div className="day-number">{dayNum}</div>
                      </div>

                      {timeSlots.map((time, timeIndex) => {
                        const isAvailable = isSlotAvailable(date, time);
                        const isStart = isStartTimeSlot(date, time);
                        const isEnd = isEndTimeSlot(date, time);
                        const isInRange = isInSelectedRange(date, time);

                        const isSelectedStart =
                          isMultiBooking &&
                          isSelectedBookingSlot(date, time, "start");
                        const isSelectedEnd =
                          isMultiBooking &&
                          isSelectedBookingSlot(date, time, "end");

                        let slotClass = "booked";

                        if (isAvailable) {
                          slotClass = "available";

                          if (isStart || isSelectedStart) {
                            slotClass = "start-time";
                          } else if (isEnd || isSelectedEnd) {
                            slotClass = "end-time";
                          } else if (isInRange) {
                            slotClass = "in-range";
                          }
                        }

                        return (
                          <div
                            key={`slot-${dateIndex}-${timeIndex}`}
                            className={`time-slot ${slotClass}`}
                            onClick={
                              isAvailable
                                ? () => handleSlotClick(date, time)
                                : undefined
                            }
                          >
                            {(isStart || isSelectedStart) && (
                              <div className="slot-label">BẮT ĐẦU</div>
                            )}
                            {(isEnd || isSelectedEnd) && (
                              <div className="slot-label">KẾT THÚC</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="no-court-selected">
              <p>Vui lòng chọn một sân để xem lịch đặt</p>
            </div>
          )}

          <div className="calendar-panel">
            <div className="month-header">
              <h2>Tháng {currentMonth.getMonth() + 1}</h2>
              <p>{currentDateStr}</p>
            </div>
            <div className="month-navigation">
              <button className="month-nav-btn prev" onClick={handlePrevMonth}>
                <FaChevronLeft />
              </button>
              <h3>
                Tháng {currentMonth.getMonth() + 1} {currentMonth.getFullYear()}
              </h3>
              <button className="month-nav-btn next" onClick={handleNextMonth}>
                <FaChevronRight />
              </button>
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
                    onClick={() => {
                      setSelectedDate(day.date);
                      if (
                        day.date < currentWeek[0] ||
                        day.date > currentWeek[6]
                      ) {
                        setCurrentWeek(getWeekDays(day.date));
                      }
                    }}
                  >
                    {day.date.getDate()}
                  </div>
                ))}
              </div>
            </div>

            <div className="legend">
              <div className="legend-item">
                <div className="color-box available"></div>
                <span>Sân trống</span>
              </div>
              <div className="legend-item">
                <div className="color-box booked"></div>
                <span>Đã đặt</span>
              </div>
              <div className="legend-item">
                <div className="color-box start-time"></div>
                <span>Giờ bắt đầu</span>
              </div>
              <div className="legend-item">
                <div className="color-box end-time"></div>
                <span>Giờ kết thúc</span>
              </div>
              <div className="legend-item">
                <div className="color-box in-range"></div>
                <span>Thời gian đã chọn</span>
              </div>
            </div>

            {!isMultiBooking && (
              <div className="booking-info">
                <h3>Thông tin đặt sân</h3>
                <div className="booking-detail">
                  <div className="label">Ngày:</div>
                  <div className="value">
                    {selectedDay
                      ? selectedDay.toLocaleDateString("vi-VN")
                      : "--/--/----"}
                  </div>
                </div>
                <div className="booking-detail">
                  <div className="label">Giờ bắt đầu:</div>
                  <div className="value">
                    {formatDisplayTime(startTime) || "--:--"}
                  </div>
                </div>
                <div className="booking-detail">
                  <div className="label">Giờ kết thúc:</div>
                  <div className="value">
                    {formatDisplayTime(endTime) || "--:--"}
                  </div>
                </div>
                <div className="booking-detail">
                  <div className="label">Tổng thời gian:</div>
                  <div className="value">
                    {bookingDuration > 0 ? `${bookingDuration} giờ` : "--"}
                  </div>
                </div>
              </div>
            )}

            {isMultiBooking && (
              <div className="booking-info admin-booking-info">
                <h3>Danh sách đặt sân ({selectedBookings.length})</h3>

                {currentSelection.startTime && (
                  <div className="current-selection">
                    <h4>Đang chọn:</h4>
                    <div className="booking-detail">
                      <div className="label">Giờ bắt đầu:</div>
                      <div className="value">
                        {formatDisplayTime(currentSelection.startTime)}
                      </div>
                    </div>
                    <div className="booking-detail">
                      <div className="label">Giờ kết thúc:</div>
                      <div className="value">
                        {formatDisplayTime(currentSelection.endTime) ||
                          "Chưa chọn"}
                      </div>
                    </div>
                    <button
                      className="reset-selection-btn"
                      onClick={resetCurrentSelection}
                    >
                      Hủy lựa chọn hiện tại
                    </button>
                  </div>
                )}

                <div className="selected-bookings-list">
                  {selectedBookings.length === 0 ? (
                    <p className="no-bookings">Chưa có đặt sân nào được chọn</p>
                  ) : (
                    selectedBookings.map((booking, index) => (
                      <div key={booking.id} className="booking-item">
                        <div className="booking-info-row">
                          <span className="booking-number">#{index + 1}</span>
                          <div className="booking-details">
                            <div className="booking-date">
                              {booking.selectedDay.toLocaleDateString("vi-VN")}
                            </div>
                            <div className="booking-time">
                              {booking.startTime} - {booking.endTime} (
                              {booking.duration}h)
                            </div>
                          </div>
                          <button
                            className="remove-booking-btn"
                            onClick={() => removeBooking(booking.id)}
                            title="Xóa booking này"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {selectedBookings.length > 0 && (
                  <div className="booking-summary">
                    <div className="summary-row">
                      <span className="label">Tổng số booking:</span>
                      <span className="value">{selectedBookings.length}</span>
                    </div>
                    <div className="summary-row">
                      <span className="label">Tổng thời gian:</span>
                      <span className="value">
                        {selectedBookings.reduce(
                          (sum, booking) => sum + booking.duration,
                          0
                        )}{" "}
                        giờ
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="time-selection-guide">
              <p>
                {isMultiBooking ? "Cách đặt sân (Admin):" : "Cách đặt sân:"}
              </p>
              {isMultiBooking ? (
                <ol>
                  <li>Chọn ngày trên lịch hoặc ô ngày</li>
                  <li>
                    Chọn một ô xanh lá để đặt <strong>giờ bắt đầu</strong> cho
                    booking đầu tiên
                  </li>
                  <li>
                    Chọn một ô xanh lá khác để đặt <strong>giờ kết thúc</strong>{" "}
                    cho booking đó
                  </li>
                  <li>
                    Có thể tiếp tục chọn <strong>nhiều khung giờ khác</strong>{" "}
                    trên cùng ngày hoặc <strong>ngày khác</strong>
                  </li>
                  <li>
                    Sử dụng nút <strong>Xóa</strong> để bỏ bất kỳ booking nào
                    không mong muốn
                  </li>
                </ol>
              ) : (
                <ol>
                  <li>Chọn ngày trên lịch hoặc ô ngày</li>
                  <li>
                    Chọn một ô xanh lá để đặt <strong>giờ bắt đầu</strong>
                  </li>
                  <li>
                    Chọn một ô xanh lá khác để đặt <strong>giờ kết thúc</strong>
                  </li>
                </ol>
              )}
            </div>

            <button
              className="continue-button"
              disabled={
                isMultiBooking
                  ? selectedBookings.length === 0
                  : !startTime || !endTime
              }
              onClick={handleCheckout}
            >
              {isMultiBooking
                ? selectedBookings.length === 0
                  ? "Vui lòng chọn ít nhất một khung giờ"
                  : `Tiếp tục với ${selectedBookings.length} booking đã chọn`
                : !startTime || !endTime
                ? "Vui lòng chọn thời gian đặt sân"
                : `Tiếp tục với ${bookingDuration} giờ đã chọn`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
