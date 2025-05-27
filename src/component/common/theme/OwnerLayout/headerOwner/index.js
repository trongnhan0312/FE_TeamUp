import { memo, useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import { logout } from "../../../../../utils/auth"; // Import hàm logout
import { useNavigate } from "react-router-dom";

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
import logo from "../../../../../assets/admin/logo.png"; // Import logo

const HeaderOwner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Xử lý tìm kiếm, ví dụ redirect hoặc gọi API
    console.log("Tìm kiếm từ khóa:", searchTerm);
    // Ví dụ: chuyển trang với từ khóa
    // navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  };
  const handleLogout = () => {
    logout(); // gọi hàm logout từ utils
    navigate("/login", { replace: true }); // chuyển hướng về login
  };

  return (
    <>
      <div className="owner-layout">
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
                <form className="search_form" onSubmit={handleSearch}>
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
                    <li>
                      <Link to="/owner/" className="icon-link">
                        <BsGraphUpArrow />
                        <div className="tooltip-text">Thống kê tăng trưởng</div>
                      </Link>
                    </li>
                  </li>
                  <li>
                    <Link to="/owner/pitchhistory" className="icon-link">
                      <div className="tooltip-text">Lịch Sử Đặt Sân</div>
                      <BsFileEarmark />
                    </Link>
                  </li>
                  <li>
                    <Link to="/owner/humanhabits" className="icon-link">
                      <BsClipboardData />
                      <div className="tooltip-text">Thói Quen Người Dùng</div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/owner/bookingmanagement" className="icon-link">
                      <BsCoin />
                    </Link>
                  </li>
                  <li>
                    <Link to="/owner/createyard" className="icon-link">
                      <BsHouseAdd />
                      <div className="tooltip-text">Tạo Sân Thể Thao</div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/owner/reviewyard" className="icon-link">
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
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <img src={logo} alt="Avatar" className="avatar" />
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

export default memo(HeaderOwner);
