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
import banner from "../../../assets/admin/banner.png";
import bongda from "../../../assets/admin/bongda.png";
import pickleball from "../../../assets/admin/pickleball.png";
import cauLong from "../../../assets/admin/caulong.png";
import trandau1 from "../../../assets/admin/trandau1.png";

const HomePage = () => {
  const navigate = useNavigate();
  const [coaches, setCoaches] = useState([]);
  const [currentCoachIndex, setCurrentCoachIndex] = useState(0);
  const [coachesPerPage] = useState(4);

  // State cho phần courts
  const [courts, setCourts] = useState([]);
  const [currentCourtIndex, setCurrentCourtIndex] = useState(0);
  const [courtsPerPage] = useState(4);

  // State cho sân featured (sân chính hiển thị ở banner)
  const [featuredCourt, setFeaturedCourt] = useState(null);
  const [loadingFeaturedCourt, setLoadingFeaturedCourt] = useState(true);

  // Fetch sân featured (sân đầu tiên hoặc sân có ID cụ thể)
  useEffect(() => {
    const fetchFeaturedCourt = async () => {
      try {
        setLoadingFeaturedCourt(true);
        // Lấy sân đầu tiên từ danh sách, hoặc bạn có thể chỉ định ID cụ thể
        const result = await courtService.getList(1, 1);
        const firstCourt = result?.resultObj?.items?.[0];

        if (firstCourt) {
          setFeaturedCourt(firstCourt);
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin sân featured:", err);
      } finally {
        setLoadingFeaturedCourt(false);
      }
    };
    fetchFeaturedCourt();
  }, []);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const result = await courtService.getList(1, 12);
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
        const result = await employeeService.getCoachesPagination("", 1, 12);
        setCoaches(result?.resultObj?.items || []);
      } catch (err) {
        console.error("Lỗi khi tải danh sách HLV:", err);
      }
    };
    fetchCoaches();
  }, []);

  const handleBookingClick = () => {
    // Sử dụng ID của sân featured thay vì hardcode
    const courtId = featuredCourt?.id;
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
      <div className="content_wrapper">
        {/* Cột bên trái - hình ảnh */}
        <div className="bg">
          <div className="left_column">
            <img
              src={
                featuredCourt?.imageUrls?.[0] || banner || "/placeholder.svg"
              }
              alt="Banner sân"
              className="banner_image"
            />
          </div>

          {/* Cột bên phải - thông tin */}
          <div className="right_column">
            {loadingFeaturedCourt ? (
              <div className="loading">
                <h1>Đang tải thông tin sân...</h1>
              </div>
            ) : featuredCourt ? (
              <>
                <h1>{featuredCourt.name || "Sân cầu lông Bình Lợi"}</h1>
                <div className="rating">
                  <span>Đặt sân</span>
                  <span className="star">
                    ⭐{" "}
                    {featuredCourt.ratingSummaryModelView?.averageRating?.toFixed(
                      1
                    ) || "4.9"}
                  </span>
                  <span>
                    (
                    {featuredCourt.ratingSummaryModelView?.totalReviewerCount ||
                      0}{" "}
                    đánh giá)
                  </span>
                </div>

                <button className="booking_button" onClick={handleBookingClick}>
                  Đặt sân
                </button>
              </>
            ) : (
              <>
                <h1>Sân cầu lông Bình Lợi</h1>
                <div className="rating">
                  <span>Đặt sân</span>
                  <span className="star">⭐ 4.9</span>
                  <span>đánh giá</span>
                </div>
                <button className="booking_button" onClick={handleBookingClick}>
                  Đặt sân
                </button>
              </>
            )}
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
              console.log(coach);
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
                    <h1 className="coach_specialty">
                      Bằng Cấp: {coach.certificate || "Chưa rõ"}
                    </h1>
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
