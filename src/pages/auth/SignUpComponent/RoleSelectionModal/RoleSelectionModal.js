"use client";

import { useEffect } from "react";
import "./RoleSelectionModal.scss";

const RoleSelectionModal = ({ isOpen, onClose, onSelectRole, loading }) => {
  // Ngăn scroll khi modal mở
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const roles = [
    {
      id: "user",
      title: "Người chơi",
      description:
        "Tìm kiếm và đặt sân thể thao, tham gia các hoạt động thể thao",
      icon: "🏸",
      color: "#4CAF50",
    },
    {
      id: "owner",
      title: "Chủ sân",
      description: "Quản lý sân thể thao, cho thuê sân và quản lý đặt chỗ",
      icon: "🏢",
      color: "#2196F3",
    },
    {
      id: "coach",
      title: "Huấn luyện viên",
      description:
        "Cung cấp dịch vụ huấn luyện, tạo lớp học và quản lý học viên",
      icon: "👨‍🏫",
      color: "#FF9800",
    },
  ];

  const handleRoleSelect = (roleId) => {
    if (!loading) {
      console.log("🟢 Vai trò được chọn:", roleId); // 👈 LOG RA CONSOLE
      onSelectRole(roleId);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return (
    <div className="role-modal-overlay" onClick={handleBackdropClick}>
      <div className="role-modal">
        <div className="role-modal-header">
          <h2>Bạn muốn đăng ký với vai trò là gì?</h2>
          <p>
            Chọn vai trò phù hợp để chúng tôi có thể cung cấp trải nghiệm tốt
            nhất cho bạn
          </p>
          {!loading && (
            <button className="close-button" onClick={onClose} type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="role-options">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`role-option ${loading ? "disabled" : ""}`}
              onClick={() => handleRoleSelect(role.id)}
              style={{ "--role-color": role.color }}
            >
              <div className="role-icon">{role.icon}</div>
              <div className="role-content">
                <h3>{role.title}</h3>
                <p>{role.description}</p>
              </div>
              <div className="role-arrow">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M7.5 15L12.5 10L7.5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Đang xử lý đăng ký...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelectionModal;
