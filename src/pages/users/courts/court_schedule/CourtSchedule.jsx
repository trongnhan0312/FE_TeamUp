import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./CourtSchedule.scss";
import { useNavigate, useParams } from "react-router-dom";
import courtService from "../../../../services/courtService";

const CourtSchedule = () => {
    const { courtId } = useParams();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentWeek, setCurrentWeek] = useState(getWeekDays(new Date()));
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState([]);
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Thay đổi state để lưu thời gian bắt đầu và kết thúc
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [bookingDuration, setBookingDuration] = useState(0);

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

            today.setHours(0, 0, 0, 0);

            // Tìm ngày bắt đầu hợp lệ (ngày đầu tuần hoặc ngày hiện tại, tùy cái nào sau)
            let startDateObj = new Date(currentWeek[0]);

            // So sánh xem ngày đầu tuần có trước ngày hiện tại không
            if (startDateObj < today) {
                // Nếu ngày đầu tuần đã qua, sử dụng ngày hiện tại làm startDate
                startDateObj = today;
            }

            const startDate = formatDateForApi(startDateObj);

            const currentTimeStr = `${currentHour
                .toString()
                .padStart(2, "0")}:${currentMinute
                    .toString()
                    .padStart(2, "0")}`;

            console.log("Gọi API với thời gian hiện tại:", currentTimeStr);

            try {
                const data = await courtService.getFreeHours(
                    courtId,
                    startDate,
                    currentTimeStr
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

    // Format ngày YYYY-MM-DD cho API
    const formatDateForApi = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
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

        // Thêm ngày trong tháng hiện tại
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
    // Xử lý tháng trước/sau
    const handlePrevMonth = () => {
        const prevMonth = new Date(currentMonth);
        prevMonth.setMonth(prevMonth.getMonth() - 1);

        // Lấy tháng hiện tại
        const today = new Date();
        today.setDate(1); // Đặt về ngày đầu tiên của tháng hiện tại
        today.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00

        // Chỉ cho phép thay đổi nếu tháng trước không ở quá khứ
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

    // Xử lý khi người dùng chọn một slot
    const handleSlotClick = (date, time) => {
        // Kiểm tra xem slot có khả dụng không, nếu không thì ngừng xử lý
        if (!isSlotAvailable(date, time)) {
            return; // Không làm gì nếu slot đã được đặt (không khả dụng)
        }

        // Nếu chưa có giờ bắt đầu hoặc đã có cả giờ bắt đầu và kết thúc, đặt lại
        if (!startTime || (startTime && endTime)) {
            setStartTime(time);
            setEndTime(null);
            setSelectedDay(date);
            setBookingDuration(0);
        }
        // Nếu đã có giờ bắt đầu nhưng chưa có giờ kết thúc
        else if (startTime && !endTime) {
            // Kiểm tra xem giờ kết thúc có sau giờ bắt đầu không và cùng ngày
            const isSameDay = dateToString(selectedDay) === dateToString(date);
            const startHour = parseInt(startTime.split(":")[0]);
            const selectedHour = parseInt(time.split(":")[0]);

            if (isSameDay && selectedHour > startHour) {
                // Kiểm tra xem tất cả các slot giữa startTime và time có khả dụng không
                const allSlotsAvailable = checkAllSlotsAvailable(
                    date,
                    startHour,
                    selectedHour
                );

                if (allSlotsAvailable) {
                    setEndTime(time);
                    // Tính số giờ đặt sân
                    setBookingDuration(selectedHour - startHour);
                } else {
                    // Nếu có slot nào đó giữa startTime và time không khả dụng
                    alert(
                        "Không thể chọn khoảng thời gian này vì có slot đã được đặt ở giữa."
                    );
                }
            } else {
                // Nếu chọn ngày khác hoặc giờ trước giờ bắt đầu, đặt lại
                setStartTime(time);
                setEndTime(null);
                setSelectedDay(date);
                setBookingDuration(0);
            }
        }
    };

    // Thêm hàm mới để kiểm tra tất cả các slot giữa startHour và endHour
    const checkAllSlotsAvailable = (date, startHour, endHour) => {
        // Chuyển đổi từ giờ sang chuỗi định dạng "HH:00"
        const checkHours = [];
        for (let hour = startHour + 1; hour < endHour; hour++) {
            checkHours.push(`${hour.toString().padStart(2, "0")}:00`);
        }

        // Kiểm tra từng slot
        return checkHours.every((time) => isSlotAvailable(date, time));
    };

    // Kiểm tra xem một slot có khả dụng không
    const isSlotAvailable = (date, time) => {
        const dateStr = dateToString(date);
        const dayData = scheduleData.find((day) => day.date === dateStr);

        if (!dayData || !dayData.freeSlots) return false;

        // Kiểm tra xem time slot có trong danh sách freeSlots không
        return dayData.freeSlots.some((slot) => {
            const slotStartHour = parseInt(slot.startTime.split(":")[0]);
            const slotEndHour = parseInt(slot.endTime.split(":")[0]);
            const timeHour = parseInt(time.split(":")[0]);

            return slotStartHour <= timeHour && timeHour < slotEndHour;
        });
    };

    // Kiểm tra xem một slot có được chọn làm thời gian bắt đầu không
    const isStartTimeSlot = (date, time) => {
        return (
            startTime === time &&
            selectedDay &&
            dateToString(date) === dateToString(selectedDay)
        );
    };

    // Kiểm tra xem một slot có được chọn làm thời gian kết thúc không
    const isEndTimeSlot = (date, time) => {
        return (
            endTime === time &&
            selectedDay &&
            dateToString(date) === dateToString(selectedDay)
        );
    };

    // Kiểm tra xem một slot có nằm trong khoảng đã chọn không
    const isInSelectedRange = (date, time) => {
        if (
            !startTime ||
            !selectedDay ||
            dateToString(date) !== dateToString(selectedDay)
        ) {
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

    const handleCheckout = () => {
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
                                    // Kiểm tra xem slot này có khả dụng không
                                    const isAvailable = isSlotAvailable(
                                        date,
                                        time
                                    );

                                    // Kiểm tra các trạng thái đã chọn
                                    const isStart = isStartTimeSlot(date, time);
                                    const isEnd = isEndTimeSlot(date, time);
                                    const isInRange = isInSelectedRange(
                                        date,
                                        time
                                    );

                                    // Xác định class dựa trên trạng thái
                                    let slotClass = "booked"; // Mặc định là đã đặt

                                    if (isAvailable) {
                                        slotClass = "available";

                                        if (isStart) {
                                            slotClass = "start-time";
                                        } else if (isEnd) {
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
                                                    ? () =>
                                                        handleSlotClick(
                                                            date,
                                                            time
                                                        )
                                                    : undefined
                                            }
                                        >
                                            {isStart && (
                                                <div className="slot-label">
                                                    BẮT ĐẦU
                                                </div>
                                            )}
                                            {isEnd && (
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

                <div className="time-selection-guide">
                    <p>Cách đặt sân:</p>
                    <ol>
                        <li>Chọn ngày trên lịch hoặc ô ngày</li>
                        <li>
                            Chọn một ô xanh lá để đặt{" "}
                            <strong>giờ bắt đầu</strong>
                        </li>
                        <li>
                            Chọn một ô xanh lá khác để đặt{" "}
                            <strong>giờ kết thúc</strong>
                        </li>
                    </ol>
                </div>

                <button
                    className="continue-button"
                    disabled={!startTime || !endTime}
                    onClick={handleCheckout}
                >
                    {!startTime || !endTime
                        ? "Vui lòng chọn thời gian đặt sân"
                        : `Tiếp tục với ${bookingDuration} giờ đã chọn`}
                </button>
            </div>
        </div>
    );
};

export default CourtSchedule;
