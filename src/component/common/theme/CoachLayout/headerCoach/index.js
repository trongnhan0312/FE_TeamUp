import { memo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getUserInfo } from "../../../../../utils/auth";
import coachService from "../../../../../services/coachService";
import "./style.scss";
import {
  BsClipboardData,
  BsChatHeart,
  BsBoxArrowRight,
  BsChat,
  BsHouse,
} from "react-icons/bs";
import logo from "../../../../../assets/admin/logo.png";

const HeaderCoach = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getUserInfo());
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {
    if (user?.id) {
      coachService
        .getCoachProfile(user.id)
        .then((response) => {
          if (response.isSuccessed && response.resultObj) {
            setUser(response.resultObj);
          }
        })
        .catch((err) => {
          console.error("Lỗi lấy thông tin coach:", err);
        });
    }
  }, [user?.id]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Tìm kiếm từ khóa:", searchTerm);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="coach-layout">
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
            </div>

            <div className="header_right">
              <ul
                className="icons"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                }}
              >
                <li>
                  <Link to="/coach" className="icon-link">
                    <BsHouse />
                    <div className="tooltip-text">Trang Chủ</div>
                  </Link>
                </li>
                <li>
                  <Link to="/coach/chat" className="icon-link">
                    <BsChat />
                    <div className="tooltip-text">Trò Truyện</div>
                  </Link>
                </li>
                <li>
                  <Link to="/coach/reviewCoach" className="icon-link">
                    <BsChatHeart />
                    <div className="tooltip-text">Đánh Giá</div>
                  </Link>
                </li>
                <li>
                  <Link to="/coach/CoachHistory" className="icon-link">
                    <BsClipboardData />
                    <div className="tooltip-text">Lịch Sử</div>
                  </Link>
                </li>
              </ul>
              {/* Dấu gạch đứng phân cách */}
              <div
                style={{
                  width: "1px",
                  height: "30px",
                  backgroundColor: "#ccc",
                  margin: "0 10px",
                }}
              ></div>
              <ul
                className="icons"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                }}
              >
                <li
                  onClick={handleLogout}
                  title="Logout"
                  style={{ cursor: "pointer" }}
                >
                  <BsBoxArrowRight />
                </li>
              </ul>

              {/* Avatar và tên người dùng */}
              <div
                className="user"
                onClick={() => navigate("/coachProfile")}
                style={{ marginLeft: "20px", cursor: "pointer" }}
              >
                <img
                  src={user?.avatarUrl || user?.avatar || defaultAvatar}
                  alt="Avatar"
                  className="avatar"
                />
                <span className="username">{user?.fullName || "Coach"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(HeaderCoach);
