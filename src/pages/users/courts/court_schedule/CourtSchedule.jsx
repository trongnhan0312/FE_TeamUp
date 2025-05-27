import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaTrash } from "react-icons/fa";
import "./CourtSchedule.scss";
import { useNavigate, useParams } from "react-router-dom";
import courtService from "../../../../services/courtService";

const CourtSchedule = ({ userRole = "user" }) => { // Thêm prop userRole
    const { courtId } = useParams();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentWeek, setCurrentWeek] = useState(getWeekDays(new Date()));
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState([]);
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // State cho single booking (user thường)
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [bookingDuration, setBookingDuration] = useState(0);

    // State cho multiple bookings (admin)
    const [selectedBookings, setSelectedBookings] = useState([]);
    const [currentSelection, setCurrentSelection] = useState({
        startTime: null,
        endTime: null,
        selectedDay: null
    });

    // Kiểm tra xem user có phải admin không
    const isAdmin = userRole === "admin";

    // Tạo ngày trong lịch tháng khi currentMonth thay đổi
    useEffect(() => {
        setCalendarDays(getCalendarDays(currentMonth));
    }, [currentMonth]);

    // Fetch data từ API khi currentWeek thay đổi
    useEffect(() => {
        if (!courtId) {
            console.error("Không có courtId");
            setError("Không thể xác định sân. Vui lòng thử lại.");
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

            const isToday = startDateObj.getDate() === today.getDate() &&
                startDateObj.getMonth() === today.getMonth() &&
                startDateObj.getFullYear() === today.getFullYear();

            if (isToday) {
                formattedStartDate = formatDateForApi(startDateObj, currentHour, currentMinute);
            } else {
                formattedStartDate = formatDateForApi(startDateObj, 0, 0);
            }

            console.log("Gọi API với ngày và giờ:", formattedStartDate);

            try {
                const data = await courtService.getFreeHours(
                    courtId,
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
    }, [courtId, currentWeek]);

    // Format ngày YYYY-MM-DD HH:mm cho API
    const formatDateForApi = (date, hour = 0, minute = 0) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedHour = String(hour).padStart(2, "0");
        const formattedMinute = String(minute).padStart(2, "0");

        return `${year}-${month}-${day} ${formattedHour}:${formattedMinute}`;
    };

    // Hàm lấy các ngày trong tuần
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

    // Hàm tạo giờ từ 5:00 đến 23:00 với format "HH:00"
    function getTimeSlots() {
        const slots = [];
        for (let i = 5; i <= 23; i++) {
            const hour = i.toString().padStart(2, "0");
            slots.push(`${hour}:00`);
        }
        return slots;
    }

    // Xử lý tháng trước/sau
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

    // Xử lý tuần trước/sau
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

    // Format ngày
    const formatDate = (date) => {
        return new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
        }).format(date);
    };

    // Kiểm tra xem một ngày có phải là ngày được chọn
    const isSelectedDate = (date) => {
        return (
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear()
        );
    };

    // Chuyển đổi một ngày date object thành chuỗi YYYY-MM-DD
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

    // Các timeslot từ 5:00 đến 24:00
    const timeSlots = getTimeSlots();

    // Hàm xử lý cho user thường (single booking)
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
            const startHour = parseInt(startTime.split(":")[0]);
            const selectedHour = parseInt(time.split(":")[0]);

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

    // Hàm xử lý cho admin (multiple bookings)
    const handleMultiBookingSlot = (date, time) => {
        if (!isSlotAvailable(date, time)) {
            return;
        }

        // Kiểm tra xem slot này đã được chọn trong các booking khác chưa
        const isAlreadySelected = selectedBookings.some(booking =>
            dateToString(booking.selectedDay) === dateToString(date) &&
            isTimeInRange(time, booking.startTime, booking.endTime)
        );

        if (isAlreadySelected) {
            alert("Khung giờ này đã được chọn trong một booking khác!");
            return;
        }

        if (!currentSelection.startTime || (currentSelection.startTime && currentSelection.endTime)) {
            setCurrentSelection({
                startTime: time,
                endTime: null,
                selectedDay: date
            });
        } else if (currentSelection.startTime && !currentSelection.endTime) {
            const isSameDay = dateToString(currentSelection.selectedDay) === dateToString(date);
            const startHour = parseInt(currentSelection.startTime.split(":")[0]);
            const selectedHour = parseInt(time.split(":")[0]);

            if (isSameDay && selectedHour > startHour) {
                const allSlotsAvailable = checkAllSlotsAvailable(
                    date,
                    startHour,
                    selectedHour
                );

                if (allSlotsAvailable) {
                    // Kiểm tra xem có conflict với booking khác không
                    const hasConflict = selectedBookings.some(booking =>
                        dateToString(booking.selectedDay) === dateToString(date) &&
                        hasTimeOverlap(currentSelection.startTime, time, booking.startTime, booking.endTime)
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
                        id: Date.now() // Unique ID cho booking
                    };

                    setSelectedBookings(prev => [...prev, newBooking]);
                    setCurrentSelection({
                        startTime: null,
                        endTime: null,
                        selectedDay: null
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
                    selectedDay: date
                });
            }
        }
    };

    // Hàm chính xử lý khi click slot
    const handleSlotClick = (date, time) => {
        if (isAdmin) {
            handleMultiBookingSlot(date, time);
        } else {
            handleSingleBookingSlot(date, time);
        }
    };

    // Helper function để kiểm tra thời gian có nằm trong range không
    const isTimeInRange = (time, startTime, endTime) => {
        const timeHour = parseInt(time.split(":")[0]);
        const startHour = parseInt(startTime.split(":")[0]);
        const endHour = parseInt(endTime.split(":")[0]);
        return timeHour >= startHour && timeHour < endHour;
    };

    // Helper function để kiểm tra overlap giữa 2 khoảng thời gian
    const hasTimeOverlap = (start1, end1, start2, end2) => {
        const start1Hour = parseInt(start1.split(":")[0]);
        const end1Hour = parseInt(end1.split(":")[0]);
        const start2Hour = parseInt(start2.split(":")[0]);
        const end2Hour = parseInt(end2.split(":")[0]);

        return !(end1Hour <= start2Hour || end2Hour <= start1Hour);
    };

    // Xóa một booking đã chọn (chỉ cho admin)
    const removeBooking = (bookingId) => {
        setSelectedBookings(prev => prev.filter(booking => booking.id !== bookingId));
    };

    // Reset current selection
    const resetCurrentSelection = () => {
        setCurrentSelection({
            startTime: null,
            endTime: null,
            selectedDay: null
        });
    };

    // Thêm hàm mới để kiểm tra tất cả các slot giữa startHour và endHour
    const checkAllSlotsAvailable = (date, startHour, endHour) => {
        const checkHours = [];
        for (let hour = startHour + 1; hour < endHour; hour++) {
            checkHours.push(`${hour.toString().padStart(2, "0")}:00`);
        }

        return checkHours.every((time) => isSlotAvailable(date, time));
    };

    // Kiểm tra xem một slot có khả dụng không
    const isSlotAvailable = (date, time) => {
        const dateStr = dateToString(date);
        const dayData = scheduleData.find((day) => day.date === dateStr);

        if (!dayData || !dayData.freeSlots) return false;

        return dayData.freeSlots.some((slot) => {
            const slotStartHour = parseInt(slot.startTime.split(":")[0]);
            const slotEndHour = parseInt(slot.endTime.split(":")[0]);
            const timeHour = parseInt(time.split(":")[0]);

            return slotStartHour <= timeHour && timeHour < slotEndHour;
        });
    };

    // Kiểm tra slot states cho single booking
    const isStartTimeSlot = (date, time) => {
        if (isAdmin) {
            return currentSelection.startTime === time &&
                currentSelection.selectedDay &&
                dateToString(date) === dateToString(currentSelection.selectedDay);
        }
        return startTime === time &&
            selectedDay &&
            dateToString(date) === dateToString(selectedDay);
    };

    const isEndTimeSlot = (date, time) => {
        if (isAdmin) {
            return currentSelection.endTime === time &&
                currentSelection.selectedDay &&
                dateToString(date) === dateToString(currentSelection.selectedDay);
        }
        return endTime === time &&
            selectedDay &&
            dateToString(date) === dateToString(selectedDay);
    };

    const isInSelectedRange = (date, time) => {
        if (isAdmin) {
            // Kiểm tra current selection
            if (currentSelection.startTime && currentSelection.selectedDay &&
                dateToString(date) === dateToString(currentSelection.selectedDay)) {
                const timeHour = parseInt(time.split(":")[0]);
                const startHour = parseInt(currentSelection.startTime.split(":")[0]);

                if (currentSelection.endTime) {
                    const endHour = parseInt(currentSelection.endTime.split(":")[0]);
                    return timeHour > startHour && timeHour < endHour;
                }
            }

            // Kiểm tra các booking đã chọn
            return selectedBookings.some(booking =>
                dateToString(booking.selectedDay) === dateToString(date) &&
                isTimeInRange(time, booking.startTime, booking.endTime)
            );
        }

        if (!startTime || !selectedDay || dateToString(date) !== dateToString(selectedDay)) {
            return false;
        }

        const timeHour = parseInt(time.split(":")[0]);
        const startHour = parseInt(startTime.split(":")[0]);

        if (!endTime) {
            return false;
        }

        const endHour = parseInt(endTime.split(":")[0]);
        return timeHour > startHour && timeHour < endHour;
    };

    // Kiểm tra xem slot có phải là start/end của booking đã chọn không (cho admin)
    const isSelectedBookingSlot = (date, time, type) => {
        if (!isAdmin) return false;

        return selectedBookings.some(booking =>
            dateToString(booking.selectedDay) === dateToString(date) &&
            booking[type === 'start' ? 'startTime' : 'endTime'] === time
        );
    };

    const handleCheckout = () => {
        if (isAdmin) {
            if (selectedBookings.length === 0) return;

            const bookingData = {
                courtId,
                bookings: selectedBookings.map(booking => ({
                    date: dateToString(booking.selectedDay),
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    duration: booking.duration
                })),
                totalBookings: selectedBookings.length,
                totalDuration: selectedBookings.reduce((sum, booking) => sum + booking.duration, 0)
            };

            navigate("/booking-confirmation", {
                state: { bookingData, isMultiBooking: true },
            });
        } else {
            if (!startTime || !endTime || !selectedDay) return;

            const bookingData = {
                courtId,
                date: dateToString(selectedDay),
                startTime,
                endTime,
                duration: bookingDuration,
            };

            navigate("/booking-confirmation", {
                state: { bookingData },
            });
        }
    };

    if (loading && scheduleData.length === 0) {
        return (
            <div className="loading-indicator">Đang tải lịch đặt sân...</div>
        );
    }

    // Định dạng giờ HH:00 cho hiển thị
    const formatDisplayTime = (time) => {
        if (!time) return "";
        return time;
    };

    return (
        <div className="court-schedule">
            <div className="schedule-container">
                <div className="schedule-header">
                    <div className="week-selector">
                        <div className="date-range">
                            {formatDate(currentWeek[0])} -{" "}
                            {formatDate(currentWeek[6])} tháng{" "}
                            {currentWeek[0].getMonth() + 1}
                        </div>
                        <div className="week-nav">
                            <button
                                className="nav-button"
                                onClick={handlePrevWeek}
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                className="nav-button"
                                onClick={handleNextWeek}
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                    {isAdmin && (
                        <div className="admin-notice">
                            <span className="admin-badge">ADMIN</span>
                            <span>Chế độ đặt sân đa ngày</span>
                        </div>
                    )}
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
                            <div
                                key={`date-${dateIndex}`}
                                className="day-column"
                            >
                                <div className="column-header">
                                    <div className="day-name">{`T.${dayName}`}</div>
                                    <div className="day-number">{dayNum}</div>
                                </div>

                                {timeSlots.map((time, timeIndex) => {
                                    const isAvailable = isSlotAvailable(date, time);
                                    const isStart = isStartTimeSlot(date, time);
                                    const isEnd = isEndTimeSlot(date, time);
                                    const isInRange = isInSelectedRange(date, time);

                                    // Cho admin: kiểm tra các slot đã chọn
                                    const isSelectedStart = isAdmin && isSelectedBookingSlot(date, time, 'start');
                                    const isSelectedEnd = isAdmin && isSelectedBookingSlot(date, time, 'end');

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
                                                <div className="slot-label">
                                                    BẮT ĐẦU
                                                </div>
                                            )}
                                            {(isEnd || isSelectedEnd) && (
                                                <div className="slot-label">
                                                    KẾT THÚC
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="calendar-panel">
                <div className="month-header">
                    <h2>Tháng {currentMonth.getMonth() + 1}</h2>
                    <p>{currentDateStr}</p>
                </div>
                <div className="month-navigation">
                    <button
                        className="month-nav-btn prev"
                        onClick={handlePrevMonth}
                    >
                        <FaChevronLeft />
                    </button>
                    <h3>
                        Tháng {currentMonth.getMonth() + 1}{" "}
                        {currentMonth.getFullYear()}
                    </h3>
                    <button
                        className="month-nav-btn next"
                        onClick={handleNextMonth}
                    >
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
                                className={`calendar-day ${!day.currentMonth ? "other-month" : ""
                                    } ${day.isToday ? "today" : ""} ${isSelectedDate(day.date) ? "selected" : ""
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

                {/* Thông tin booking cho user thường */}
                {!isAdmin && (
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
                                {bookingDuration > 0
                                    ? `${bookingDuration} giờ`
                                    : "--"}
                            </div>
                        </div>
                    </div>
                )}

                {/* Thông tin booking cho admin */}
                {isAdmin && (
                    <div className="booking-info admin-booking-info">
                        <h3>Danh sách đặt sân ({selectedBookings.length})</h3>

                        {/* Current selection */}
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
                                        {formatDisplayTime(currentSelection.endTime) || "Chưa chọn"}
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

                        {/* Selected bookings list */}
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
                                                    {booking.startTime} - {booking.endTime} ({booking.duration}h)
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

                        {/* Summary for admin */}
                        {selectedBookings.length > 0 && (
                            <div className="booking-summary">
                                <div className="summary-row">
                                    <span className="label">Tổng số booking:</span>
                                    <span className="value">{selectedBookings.length}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="label">Tổng thời gian:</span>
                                    <span className="value">
                                        {selectedBookings.reduce((sum, booking) => sum + booking.duration, 0)} giờ
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="time-selection-guide">
                    <p>{isAdmin ? "Cách đặt sân (Admin):" : "Cách đặt sân:"}</p>
                    {isAdmin ? (
                        <ol>
                            <li>Chọn ngày trên lịch hoặc ô ngày</li>
                            <li>Chọn một ô xanh lá để đặt <strong>giờ bắt đầu</strong> cho booking đầu tiên</li>
                            <li>Chọn một ô xanh lá khác để đặt <strong>giờ kết thúc</strong> cho booking đó</li>
                            <li>Có thể tiếp tục chọn <strong>nhiều khung giờ khác</strong> trên cùng ngày hoặc <strong>ngày khác</strong></li>
                            <li>Sử dụng nút <strong>Xóa</strong> để bỏ bất kỳ booking nào không mong muốn</li>
                        </ol>
                    ) : (
                        <ol>
                            <li>Chọn ngày trên lịch hoặc ô ngày</li>
                            <li>Chọn một ô xanh lá để đặt <strong>giờ bắt đầu</strong></li>
                            <li>Chọn một ô xanh lá khác để đặt <strong>giờ kết thúc</strong></li>
                        </ol>
                    )}
                </div>

                <button
                    className="continue-button"
                    disabled={isAdmin ? selectedBookings.length === 0 : (!startTime || !endTime)}
                    onClick={handleCheckout}
                >
                    {isAdmin
                        ? (selectedBookings.length === 0
                            ? "Vui lòng chọn ít nhất một khung giờ"
                            : `Tiếp tục với ${selectedBookings.length} booking đã chọn`)
                        : (!startTime || !endTime
                            ? "Vui lòng chọn thời gian đặt sân"
                            : `Tiếp tục với ${bookingDuration} giờ đã chọn`)
                    }
                </button>
            </div>
        </div>
    );
};

export default CourtSchedule;