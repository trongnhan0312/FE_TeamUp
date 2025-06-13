import { memo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getUserInfo } from "../../../../../utils/auth";
import coachService from "../../../../../services/coachService";
import "./style.scss";
import {
  BsClipboardData,
  BsChatHeart,
  BsFillBellFill,
  BsGear,
  BsBoxArrowRight,
  BsSearch,
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
              <ul className="icons">
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
                <li onClick={handleLogout} title="Logout">
                  <BsBoxArrowRight />
                </li>
              </ul>

              <div className="user" onClick={() => navigate("/coachProfile")}>
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
