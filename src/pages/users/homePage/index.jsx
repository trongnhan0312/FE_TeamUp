import { memo } from "react";
import "./style.scss";
import { BsHeartFill } from "react-icons/bs";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { BsDoorOpenFill } from "react-icons/bs";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import banner from "../../../assets/admin/banner.png";
import bongda from "../../../assets/admin/bongda.png";
import pickleball from "../../../assets/admin/pickleball.png";
import cauLong from "../../../assets/admin/caulong.png";
import trandau1 from "../../../assets/admin/trandau1.png";
import trandau2 from "../../../assets/admin/trandau2.png";
import trandau3 from "../../../assets/admin/trandau3.png";
import trandau4 from "../../../assets/admin/trandau4.png";
import court2 from "../../../assets/admin/court2.png";
import court3 from "../../../assets/admin/court3.png";
import court4 from "../../../assets/admin/court4.png";

const HomePage = () => {
    const navigate = useNavigate();

    const handleBookingClick = () => {
        const courtId = 2;
        navigate(`/courts/${courtId}`);
    };

    const handleCourtTypeClick = (urlType) => (e) => {
        e.preventDefault();
        navigate(`/court/${urlType}`);
    };

    return (
        <div className="homepage">
            <div className="content_wrapper">
                {/* Cột bên trái - hình ảnh */}
                <div className="bg">
                    <div className="left_column">
                        <img src={banner} alt="Logo" className="banner_image" />
                    </div>

                    {/* Cột bên phải - thông tin */}
                    <div className="right_column">
                        <h1>Sân cầu lông Bình Lợi</h1>
                        <div className="rating">
                            <span>Đặt sân</span>
                            <span className="star">⭐ 4.9 </span>
                            <span>đánh giá</span>
                        </div>
                        <button
                            className="booking_button"
                            onClick={handleBookingClick}
                        >
                            Đặt sân
                        </button>{" "}
                    </div>
                </div>
            </div>

            {/* Các trường tìm kiếm */}
            <div className="search_wrapper">
                <div className="search_filters">
                    <div className="filter">
                        <span>Địa điểm</span>
                    </div>
                    <div className="filter">
                        <span>Ngày tháng</span>
                    </div>
                    <div className="filter">
                        <span>Khung giờ</span>
                    </div>
                    <button className="search_button">Tìm</button>
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
                        src={pickleball}
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
                    <img src={bongda} alt="Bóng đá" className="card_image" />
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
                    <img src={cauLong} alt="Cầu lông" className="card_image" />
                    <div className="card_content">
                        <h2>Cầu lông</h2>
                        <div className="card_button">
                            <BsArrowUpRightCircleFill />
                            Tìm hiểu thêm
                        </div>
                    </div>
                </a>
            </div>
            {/* Trận đấu sắp diễn ra */}
            <div className="upcoming_matches">
                <h2>Trận sắp diễn ra</h2>
                <div className="matches_container">
                    <div className="match_card">
                        <img
                            src={trandau1}
                            alt="Match 1"
                            className="match_image"
                        />
                        <div className="card_icons">
                            <BsHeartFill className="icon-heart" />
                            <BsDoorOpenFill className="icon-door" />
                        </div>
                    </div>

                    <div className="match_card">
                        <img
                            src={trandau2}
                            alt="Match 2"
                            className="match_image"
                        />
                        <div className="card_icons">
                            <BsHeartFill className="icon-heart" />
                            <BsDoorOpenFill className="icon-door" />
                        </div>
                    </div>
                    <div className="match_card">
                        <img
                            src={trandau3}
                            alt="Match 3"
                            className="match_image"
                        />
                        <div className="card_icons">
                            <BsHeartFill className="icon-heart" />
                            <BsDoorOpenFill className="icon-door" />
                        </div>
                    </div>
                    <div className="match_card">
                        <img
                            src={trandau4}
                            alt="Match 4"
                            className="match_image"
                        />
                        <div className="card_icons">
                            <BsHeartFill className="icon-heart" />
                            <BsDoorOpenFill className="icon-door" />
                        </div>
                    </div>
                </div>
                <button className="view_more">Xem thêm</button>
            </div>

            {/* Các sân gần đây */}
            <div className="nearby_courts">
                <h2>Sân gần đây</h2>

                <div className="matches_container">
                    <div className="court_card">
                        <h3>Bình Triệu</h3>
                        <img
                            src={trandau1}
                            alt="Court 1"
                            className="court_image"
                        />

                        <div className="rating">
                            <span>⭐ 4.9 </span>
                            <span>(352 đánh giá)</span>
                        </div>
                        <div className="card_icons">
                            <BsHeartFill className="icon-heart" />
                            <BsFillPlusCircleFill className="icon-door" />
                        </div>
                    </div>

                    <div className="court_card">
                        <h3>Bình Triệu</h3>
                        <img
                            src={court2}
                            alt="Court 2"
                            className="court_image"
                        />

                        <div className="rating">
                            <span>⭐ 4.9 </span>
                            <span>(352 đánh giá)</span>
                        </div>
                        <div className="card_icons">
                            <BsHeartFill className="icon-heart" />
                            <BsFillPlusCircleFill className="icon-door" />
                        </div>
                    </div>

                    <div className="court_card">
                        <h3>Bình Triệu</h3>
                        <img
                            src={court3}
                            alt="Court 3"
                            className="court_image"
                        />

                        <div className="rating">
                            <span>⭐ 4.9 </span>
                            <span>(352 đánh giá)</span>
                        </div>
                        <div className="card_icons">
                            <BsHeartFill className="icon-heart" />
                            <BsFillPlusCircleFill className="icon-door" />
                        </div>
                    </div>

                    <div className="court_card">
                        <h3>Bình Triệu</h3>
                        <img
                            src={court4}
                            alt="Court 4"
                            className="court_image"
                        />

                        <div className="rating">
                            <span>⭐ 4.9 </span>
                            <span>(352 đánh giá)</span>
                        </div>
                        <div className="card_icons">
                            <BsHeartFill className="icon-heart" />
                            <BsFillPlusCircleFill className="icon-door" />
                        </div>
                    </div>
                </div>
                <button className="view_more">Xem thêm</button>
            </div>
        </div>
    );
};

export default memo(HomePage);
