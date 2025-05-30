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
} from "react-icons/bs";
import logo from "../../../../../assets/admin/logo.png";

const HeaderCoach = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Lấy user hiện tại (đã login)
  const [user, setUser] = useState(() => getUserInfo());
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {
    if (user?.id) {
      // Gọi API lấy profile coach theo user.id
      coachService
        .getCoachProfile(user.id)
        .then((response) => {
          if (response.isSuccessed && response.resultObj) {
            setUser(response.resultObj); // Cập nhật profile coach
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
              <form className="search_form" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search_input"
                />
                <button type="submit" className="search_button">
                  <BsSearch />
                </button>
              </form>
            </div>

            <div
              className="header_right"
              style={{ display: "flex", alignItems: "center" }}
            >
              <ul
                className="icons"
                style={{
                  display: "flex",
                  gap: "20px",
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                }}
              >
                <li>
                  <Link to="/coach/chat" className="icon-link">
                    <BsChat />
                  </Link>
                </li>
                <li>
                  <Link to="/coach/reviewCoach" className="icon-link">
                    <BsChatHeart />
                  </Link>
                </li>
                <li>
                  <Link to="/coach/CoachHistory" className="icon-link">
                    <BsClipboardData />
                  </Link>
                </li>
              </ul>

              <div
                style={{
                  width: "1px",
                  height: "30px",
                  backgroundColor: "#ccc",
                  margin: "0 15px",
                }}
              ></div>

              <ul
                className="icons"
                style={{
                  display: "flex",
                  gap: "20px",
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                }}
              >
                <li>
                  <BsFillBellFill />
                </li>
                <li>
                  <BsGear />
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginLeft: "20px",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/coachProfile")}
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
