import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Question2 = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const options = [
    "Có, tôi muốn gợi ý sản phẩm phụ hợp",
    "Chưa chắc, tôi muốn tìm hiểu thêm về môn thể thao này",
    "Không, tôi chỉ muốn khám phá",
  ];
  const handleSelect = (index) => {
    setSelected(index);

    // 👇 Chuyển sang câu hỏi tiếp theo
    setTimeout(() => {
      navigate("/home");
    }, 200); // để có hiệu ứng chọn
  };

  return (
    <div className="survey-container">
      <h1 className="survey-title">
        Bạn có nhu cầu mua các sản phẩm hỗ trợ <br />
        cho môn thể thao này không?
      </h1>

      <div className="survey-options">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${selected === index ? "selected" : ""}`}
            onClick={() => handleSelect(index)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question2;
