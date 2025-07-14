import { memo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getUserInfo } from "../../../../../utils/auth";
import userService from "../../../../../services/userService";
import { fetchEmployeeById } from "../../../../../services/ownerService";
import "./style.scss";
import {
  BsGraphUpArrow,
  BsFileEarmark,
  BsClipboardData,
  BsCoin,
  BsHouseAdd,
  BsChatHeart,
  BsFillBellFill,
  BsGear,
  BsBoxArrowRight,
  BsSearch,
  BsHouses,
} from "react-icons/bs";
import logo from "../../../../../assets/admin/logo.png";

const HeaderAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Lấy user từ localStorage
  const [user, setUser] = useState(() => getUserInfo());
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {
    if (user?.id) {
      // Gọi API lấy chi tiết nhân viên/owner
      fetchEmployeeById(user.id)
        .then((data) => {
          if (data) {
            setUser(data); // Cập nhật dữ liệu mới (có avatarUrl, fullName,...)
          }
        })
        .catch((err) => {
          console.error("Lỗi lấy thông tin employee:", err);
        });
    }
  }, [user?.id]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Xử lý tìm kiếm (nếu cần)
    console.log("Tìm kiếm từ khóa:", searchTerm);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  return (
    <>
      <div className="admin-layout">
        <div className="header_top">
          <div className="container">
            <div className="header_wrapper">
              <div className="header_left">
                <div className="logo">
                  {/* Logo là link về trang chủ */}
                  <Link to="/" className="logo">
                    <img src={logo} alt="Logo" className="logo_img" />
                    <span className="logo_text">TeamUp</span>
                  </Link>
                </div>
                {/* <form className="search_form" onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search_input"
                  />
                  <button type="submit" className="search_button">
                    {" "}
                    <BsSearch />
                  </button>
                </form> */}
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
                    <Link to="/owner" className="icon-link">
                      <div className="tooltip-text">Thống Kê Tăng Trưởng</div>
                      <BsGraphUpArrow />
                    </Link>
                  </li>
                  <li>
                    <Link to="/owner/pitchhistory" className="icon-link">
                      <div className="tooltip-text">Lịch Sử Đặt Sân</div>
                      <BsFileEarmark />
                    </Link>
                  </li>
                  {/* <li>
                    <Link to="/owner/humanhabits" className="icon-link">
                      <BsClipboardData />
                      <div className="tooltip-text">Thói Quen Người Dùng</div>
                    </Link>
                  </li> */}
                  <li>
                    <Link to="/owner/bookingmanagement" className="icon-link">
                      <BsCoin />
                      <div className="tooltip-text">Quản Lí Đặt Sân</div>
                    </Link>
                  </li>
                  {/* <li>
                    <Link to="/owner/createyard" className="icon-link">
                      <BsHouseAdd />
                      <div className="tooltip-text">Tạo Sân Thể Thao</div>
                    </Link>
                  </li> */}
                  <li>
                    <Link to="/owner/ReviewOwner" className="icon-link">
                      <BsChatHeart />
                      <div className="tooltip-text">Đánh Giá</div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/owner/sportscomplexes" className="icon-link">
                      <BsHouses />
                      <div className="tooltip-text">Quản Lí Khu Thể Thao</div>
                    </Link>
                  </li>
                </ul>
                {/* Dấu gạch đứng */}
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
                  <li
                    onClick={handleLogout}
                    style={{ cursor: "pointer" }}
                    title="Logout"
                  >
                    <BsBoxArrowRight />
                  </li>
                </ul>

                {/* Avatar và tên user */}
                <div
                  className="user"
                  onClick={() => navigate("/ownerProfile")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginLeft: "20px",
                    cursor: "pointer",
                  }}
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
      </div>
      <div className="row">
        <div className="col-lg-3"></div>
      </div>
    </>
  );
};

export default memo(HeaderAdmin);
