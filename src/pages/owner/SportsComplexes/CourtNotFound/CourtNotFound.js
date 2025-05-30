import React from "react";
import "./style.scss";
import logo from "../../../../assets/admin/logo.png"; // Đường dẫn ảnh logo

const CourtNotFound = ({ onCreate }) => {
  return (
    <div className="no-courts-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="no-courts-logo" />
      </div>
      <strong>
        <p>Không có sân nào thuộc khu thể thao này. Hãy tạo mới.</p>
      </strong>
      <button className="btn-create-court" onClick={onCreate}>
        Tạo sân
      </button>
    </div>
  );
};

export default CourtNotFound;
