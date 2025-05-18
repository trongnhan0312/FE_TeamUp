import { memo } from "react";
import { Link } from "react-router-dom"; // Import Link
import "./style.scss";
import { BsChat, BsCart3, BsHeart, BsBell } from "react-icons/bs";
import logo from "../../../../assets/admin/logo.png";

const Header = () => {
    return (
        <>
            <div className="header_top">
                <div className="container">
                    <div className="header_wrapper">
                        <div className="header_left">
                            <div className="logo">
                                {/* Logo là link về trang chủ */}
                                <Link to="/" className="logo">
                                    <img
                                        src={logo}
                                        alt="Logo"
                                        className="logo_img"
                                    />
                                    <span className="logo_text">TeamUp</span>
                                </Link>
                            </div>
                            <ul className="menu">
                                {/* Dùng Link cho từng menu item */}
                                <li>
                                    <Link to="/">Trang chủ</Link>
                                </li>
                                <li>
                                    <Link to="/tim-san">Tìm sân</Link>
                                </li>
                                <li>
                                    <Link to="/tim-ban-choi">Tìm bạn chơi</Link>
                                </li>
                                <li>
                                    <Link to="/ban-do">Bản đồ</Link>
                                </li>
                                <li>
                                    <Link to="/blog">Blog</Link>
                                </li>
                                <li>
                                    <Link to="/coaches">HLV</Link>
                                </li>
                            </ul>
                        </div>

                        <div className="header_right">
                            <ul className="icons">
                                <li>
                                    <BsChat />
                                </li>
                                <li>
                                    <BsCart3 />
                                </li>
                                <li>
                                    <BsHeart />
                                </li>
                                <li>
                                    <BsBell />
                                </li>
                            </ul>
                            <div className="user">
                                <img
                                    src="https://via.placeholder.com/30"
                                    alt="Avatar"
                                    className="avatar"
                                />
                                <span className="username">Nguyễn Văn Tèo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-3"></div>
            </div>
        </>
    );
};

export default memo(Header);
