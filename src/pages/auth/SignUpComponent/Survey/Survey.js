import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";

const Survey = () => {
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  const handleSelect = (option) => {
    setSelected(option);

    // 👉 Bạn có thể lưu `option` vào localStorage hoặc context nếu cần
    setTimeout(() => {
      navigate("/question1"); // 👈 Chuyển sang câu hỏi tiếp theo
    }, 200);
  };

  return (
    <div className="survey-container">
      <h2 className="survey-title">Bạn quan tâm đến môn thể thao nào?</h2>
      <div className="survey-options">
        <button
          className={`option-button ${
            selected === "Pickleball" ? "selected" : ""
          }`}
          onClick={() => handleSelect("Pickleball")}
        >
          Pickleball
        </button>
        <button
          className={`option-button ${
            selected === "Bóng đá" ? "selected black" : "black"
          }`}
          onClick={() => handleSelect("Bóng đá")}
        >
          Bóng đá
        </button>
        <button
          className={`option-button ${
            selected === "Cầu lông" ? "selected green" : "green"
          }`}
          onClick={() => handleSelect("Cầu lông")}
        >
          Cầu lông
        </button>
      </div>
    </div>
  );
};

export default Survey;
