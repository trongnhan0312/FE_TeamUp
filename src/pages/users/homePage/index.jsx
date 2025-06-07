"use client";

import { memo } from "react";
import "./style.scss";
import { BsHeartFill } from "react-icons/bs";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import employeeService from "../../../services/coachService";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import courtService from "../../../services/courtService";
import { getUserInfo } from "../../../utils/auth";
import banner from "../../../assets/admin/banner.png";
import bongda from "../../../assets/admin/bongda.png";
import pickleball from "../../../assets/admin/pickleball.png";
import cauLong from "../../../assets/admin/caulong.png";
import trandau1 from "../../../assets/admin/trandau1.png";

const HomePage = () => {
  const navigate = useNavigate();
  const [coaches, setCoaches] = useState([]);
  const [currentCoachIndex, setCurrentCoachIndex] = useState(0);
  const [coachesPerPage] = useState(4); // Số huấn luyện viên hiển thị mỗi lần

  // State cho phần courts
  const [courts, setCourts] = useState([]);
  const [currentCourtIndex, setCurrentCourtIndex] = useState(0);
  const [courtsPerPage] = useState(4); // Số sân hiển thị mỗi lần

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const result = await courtService.getList(1, 12); // Tăng từ 4 lên 12 để có thể carousel
        setCourts(result?.resultObj?.items || []);
      } catch (err) {
        console.error("Lỗi khi tải danh sách sân:", err);
      }
    };
    fetchCourts();
  }, []);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const result = await employeeService.getCoachesPagination("", 1, 12); // Tăng từ 4 lên 12
        setCoaches(result?.resultObj?.items || []);
      } catch (err) {
        console.error("Lỗi khi tải danh sách HLV:", err);
      }
    };
    fetchCoaches();
  }, []);

  const handleBookingClick = () => {
    const courtId = 2;
    navigate(`/courts/${courtId}`);
  };

  const handleCourtTypeClick = (urlType) => (e) => {
    e.preventDefault();
    navigate(`/court/${urlType}`);
  };

  const handleCourtDetailClick = (id) => {
    navigate(`/courts/${id}`);
  };
  const handleCoachDetailClick = (coachId) => {
    navigate(`/coaches/profile/${coachId}`);
  };
  // Handlers cho coaches carousel
  const handlePrevCoaches = () => {
    setCurrentCoachIndex((prev) =>
      prev === 0
        ? Math.max(0, coaches.length - coachesPerPage)
        : Math.max(0, prev - coachesPerPage)
    );
  };

  const handleNextCoaches = () => {
    setCurrentCoachIndex((prev) =>
      prev + coachesPerPage >= coaches.length ? 0 : prev + coachesPerPage
    );
  };

  // Handlers cho courts carousel
  const handlePrevCourts = () => {
    setCurrentCourtIndex((prev) =>
      prev === 0
        ? Math.max(0, courts.length - courtsPerPage)
        : Math.max(0, prev - courtsPerPage)
    );
  };

  const handleNextCourts = () => {
    setCurrentCourtIndex((prev) =>
      prev + courtsPerPage >= courts.length ? 0 : prev + courtsPerPage
    );
  };

  const visibleCoaches = coaches.slice(
    currentCoachIndex,
    currentCoachIndex + coachesPerPage
  );
  const visibleCourts = courts.slice(
    currentCourtIndex,
    currentCourtIndex + courtsPerPage
  );

  return (
    <div className="homepage">
      {/* <div className="purple-banner"></div> */}
      <div className="content_wrapper">
        {/* Cột bên trái - hình ảnh */}
        <div className="bg">
          <div className="left_column">
            <img
              src={banner || "/placeholder.svg"}
              alt="Logo"
              className="banner_image"
            />
          </div>

          {/* Cột bên phải - thông tin */}
          <div className="right_column">
            <h1>Sân cầu lông Bình Lợi</h1>
            <div className="rating">
              <span>Đặt sân</span>
              <span className="star">⭐ 4.9 </span>
              <span>đánh giá</span>
            </div>
            <button className="booking_button" onClick={handleBookingClick}>
              Đặt sân
            </button>{" "}
          </div>
        </div>
      </div>

      {/* Các môn - Đơn giản hóa, URL param dùng để điều hướng */}
      <div className="cards_section">
        <a
          href="/court/pickleball"
          className="card card-pickleball"
          onClick={handleCourtTypeClick("pickleball")}
        >
          <img
            src={pickleball || "/placeholder.svg"}
            alt="Pickleball"
            className="card_image"
          />
          <div className="card_content">
            <h2>Pickleball</h2>
            <div className="card_button">
              <BsArrowUpRightCircleFill />
              Tìm hiểu thêm
            </div>
          </div>
        </a>

        <a
          href="/court/football"
          className="card card-bongda"
          onClick={handleCourtTypeClick("football")}
        >
          <img
            src={bongda || "/placeholder.svg"}
            alt="Bóng đá"
            className="card_image"
          />
          <div className="card_content">
            <h2>Bóng đá</h2>
            <div className="card_button">
              <BsArrowUpRightCircleFill />
              Tìm hiểu thêm
            </div>
          </div>
        </a>

        <a
          href="/court/badminton"
          className="card card-caulong"
          onClick={handleCourtTypeClick("badminton")}
        >
          <img
            src={cauLong || "/placeholder.svg"}
            alt="Cầu lông"
            className="card_image"
          />
          <div className="card_content">
            <h2>Cầu lông</h2>
            <div className="card_button">
              <BsArrowUpRightCircleFill />
              Tìm hiểu thêm
            </div>
          </div>
        </a>
      </div>

      {/* Phần Huấn luyện viên */}
      <div className="upcoming_matches">
        <div className="section_header">
          <h2>Các Huấn Luyện Viên</h2>
          <div className="navigation_buttons">
            <button
              className="nav_button prev"
              onClick={handlePrevCoaches}
              disabled={currentCoachIndex === 0}
            >
              <BsChevronLeft />
            </button>
            <button
              className="nav_button next"
              onClick={handleNextCoaches}
              disabled={currentCoachIndex + coachesPerPage >= coaches.length}
            >
              <BsChevronRight />
            </button>
          </div>
        </div>
        <div className="matches_container">
          {visibleCoaches.length > 0 ? (
            visibleCoaches.map((coach, index) => {
              console.log(coach); // debug xem có id không
              return (
                <div
                  className="match_card"
                  key={index}
                  onClick={() => handleCoachDetailClick(coach.id)}
                >
                  <img
                    src={coach.avatarUrl || trandau1}
                    alt={`Coach ${coach.fullName || "Không tên"}`}
                    className="match_image"
                  />
                  <div className="coach_info">
                    <h3 className="coach_name">
                      {coach.fullName || "Không tên"}
                    </h3>
                    <p className="coach_specialty">
                      {coach.specialty || "Chưa rõ chuyên môn"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Không có huấn luyện viên nào.</p>
          )}
        </div>

        {coaches.length > coachesPerPage && (
          <div className="pagination_dots">
            {Array.from({
              length: Math.ceil(coaches.length / coachesPerPage),
            }).map((_, index) => (
              <button
                key={index}
                className={`dot ${
                  Math.floor(currentCoachIndex / coachesPerPage) === index
                    ? "active"
                    : ""
                }`}
                onClick={() => setCurrentCoachIndex(index * coachesPerPage)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Các sân gần đây */}
      <div className="nearby_courts">
        <div className="section_header">
          <h2>Sân gần đây</h2>
        </div>

        <div className="matches_container">
          {visibleCourts.length > 0 ? (
            visibleCourts.map((court, index) => (
              <div
                className="court_card"
                key={index}
                onClick={() => handleCourtDetailClick(court.id)}
              >
                <h3>{court.name || "Tên sân chưa có"}</h3>
                <img
                  src={court.imageUrls?.[0] || trandau1}
                  alt={`Court ${court.name || index + 1}`}
                  className="court_image"
                />
                <div className="rating">
                  <span>
                    ⭐{" "}
                    {court.ratingSummaryModelView?.averageRating?.toFixed(1) ||
                      "Chưa có"}
                  </span>
                  <span>
                    ({court.ratingSummaryModelView?.totalReviewerCount || 0}{" "}
                    đánh giá)
                  </span>
                </div>
                <div className="card_icons">
                  <BsHeartFill className="icon-heart" />
                  <BsFillPlusCircleFill className="icon-door" />
                </div>
              </div>
            ))
          ) : (
            <p>Không có sân nào gần đây.</p>
          )}
        </div>

        <div className="navigation_buttons">
          <button
            className="nav_button prev"
            onClick={handlePrevCourts}
            disabled={currentCourtIndex === 0}
          >
            <BsChevronLeft />
          </button>
          <button
            className="nav_button next"
            onClick={handleNextCourts}
            disabled={currentCourtIndex + courtsPerPage >= courts.length}
          >
            <BsChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(HomePage);
