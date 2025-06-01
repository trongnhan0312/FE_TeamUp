import React, { useState, useEffect, memo } from 'react';
import { FaCalendar, FaDollarSign, FaEnvelopeOpenText, FaMapPin, FaUsers, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './CreateRoomForm.scss';

const CreateRoomForm = () => {
    const [activeTab, setActiveTab] = useState('Bóng đá');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState([]);
    const [formData, setFormData] = useState({
        hostId: 0,
        courtId: 0,
        name: '',
        maxPlayers: 20,
        description: '',
        roomFee: 100000,
        scheduledTime: '2025-06-01T03:31:29.277Z'
    });

    const tabs = ['Pickleball', 'Bóng đá', 'Cầu lông'];

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

    const currentDateStr = new Intl.DateTimeFormat('vi-VN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(selectedDate);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString('vi-VN');
    };

    const handleDateTimeChange = (field, value) => {
        if (field === 'date') {
            const currentTime = new Date(formData.scheduledTime);
            const newDate = new Date(value);
            newDate.setHours(currentTime.getHours(), currentTime.getMinutes());
            handleInputChange('scheduledTime', newDate.toISOString());
        } else if (field === 'time') {
            const currentDate = new Date(formData.scheduledTime);
            const [hours, minutes] = value.split(':');
            currentDate.setHours(parseInt(hours), parseInt(minutes));
            handleInputChange('scheduledTime', currentDate.toISOString());
        }
    };

    const getCurrentDate = () => {
        const date = new Date(formData.scheduledTime);
        return date.toISOString().split('T')[0];
    };

    const getCurrentTime = () => {
        const date = new Date(formData.scheduledTime);
        return date.toTimeString().slice(0, 5);
    };

    // Xử lý khi chọn ngày từ calendar
    const handleCalendarDateSelect = (day) => {
        setSelectedDate(day.date);
        // Cập nhật scheduledTime với ngày mới được chọn
        const currentTime = new Date(formData.scheduledTime);
        const newDate = new Date(day.date);
        newDate.setHours(currentTime.getHours(), currentTime.getMinutes());
        handleInputChange('scheduledTime', newDate.toISOString());
    };

    return (
        <div className="create-room-form">
            {/* Header Tabs */}
            <div className="tabs-container">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`tab-button ${activeTab === tab ? 'active' : ''} ${tab.toLowerCase().replace(' ', '-')}`}
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
                            <span className="section-title">Chọn ngày và giờ</span>
                        </div>

                        <div className="datetime-inputs">
                            <input
                                type="date"
                                value={getCurrentDate()}
                                onChange={(e) => handleDateTimeChange('date', e.target.value)}
                                className="form-input date-input"
                            />
                            <input
                                type="time"
                                value={getCurrentTime()}
                                onChange={(e) => handleDateTimeChange('time', e.target.value)}
                                className="form-input time-input"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="form-section">
                        <div className="section-header">
                            <FaMapPin className="icon" />
                            <span className="section-title">Địa điểm</span>
                        </div>
                        <div className="location-info">
                            <p>Sân cầu lông HAT</p>
                            <p>269 Nguyễn Thái Sơn Gò Vấp</p>
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
                                onClick={() => handleInputChange('maxPlayers', Math.max(1, formData.maxPlayers - 1))}
                                className="counter-btn decrease"
                            >
                                -
                            </button>
                            <span className="counter-value">{formData.maxPlayers}</span>
                            <button
                                onClick={() => handleInputChange('maxPlayers', formData.maxPlayers + 1)}
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
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="form-input text-input"
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
                            value={formData.roomFee.toLocaleString('vi-VN')}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, '');
                                handleInputChange('roomFee', parseInt(value) || 0);
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
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={4}
                            className="form-input textarea-input"
                        />
                    </div>
                </div>

                {/* Right Column - Calendar (Migrated from CourtSchedule) */}
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
                                    className={`calendar-day ${!day.currentMonth ? "other-month" : ""
                                        } ${day.isToday ? "today" : ""} ${isSelectedDate(day.date) ? "selected" : ""
                                        }`}
                                    onClick={() => handleCalendarDateSelect(day)}
                                >
                                    {day.date.getDate()}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="create-room-btn">
                        Tạo phòng
                    </button>
                </div>
            </div>

            {/* Debug Info */}
            <div className="debug-info">
                <h4>Form Data (for debugging):</h4>
                <pre>
                    {JSON.stringify(formData, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default memo(CreateRoomForm);