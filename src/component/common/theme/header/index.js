import { memo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getUserInfo } from "../../../../utils/auth";
import userService from "../../../../services/userService";
import "./style.scss";
import {
  BsChat,
  BsCart3,
  BsHeart,
  BsBell,
  BsBoxArrowRight,
} from "react-icons/bs";
import logo from "../../../../assets/admin/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = getUserInfo();
    return storedUser;
  });

  useEffect(() => {
    if (user?.id) {
      console.log("Fetching user info for userId:", user.id);
      userService
        .getUserById(user.id)
        .then((response) => {
          console.log("Fresh user info from API:", response);
          setUser(response.resultObj); // Lấy đúng đối tượng user
        })
        .catch((err) => {
          console.error("Lỗi lấy thông tin user:", err);
        });
    }
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <>
      <div className="header_top">
        <div className="container">
          <div className="header_wrapper">
            <div className="header_left">
              <div className="logo">
                <Link to="/" className="logo">
                  <img src={logo} alt="Logo" className="logo_img" />
                  <span className="logo_text">TeamUp</span>
                </Link>
              </div>
              <ul className="menu">
                <li>
                  <Link to="/">Trang chủ</Link>
                </li>
                <li>
                  <Link to="/court/football">Tìm sân</Link>
                </li>
                <li>
                  <Link to="/room">Tìm bạn chơi</Link>
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
                <li onClick={() => navigate("/chat")}>
                  <BsChat />
                </li>
                <li onClick={() => navigate("/court-booking-history")}>
                  <BsCart3 />
                </li>
                <li>
                  <BsHeart />
                </li>
                <li>
                  <BsBell />
                </li>
                <li
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                  title="Logout"
                >
                  <BsBoxArrowRight />
                </li>
              </ul>
              <div
                className="user"
                onClick={() => navigate("/profile")}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={user?.avatarUrl || user?.avatar || defaultAvatar}
                  alt="Avatar"
                  className="avatar"
                />
                <span className="username">
                  {user?.fullName || user?.name || "Người dùng"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Header);
