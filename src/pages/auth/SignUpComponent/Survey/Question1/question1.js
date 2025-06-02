import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Question1 = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const options = [
    "Hoàn toàn mới, chưa từng chơi",
    "Đã chơi vài lần nhưng chưa thành thạo",
    "Chơi thường xuyên để giải trí",
    "Đã chơi vài lần nhưng chưa thành thạo",
  ];

  const handleSelect = (index) => {
    setSelected(index);

    // 👇 Chuyển sang câu hỏi tiếp theo
    setTimeout(() => {
      navigate("/question2");
    }, 200); // để có hiệu ứng chọn
  };

  return (
    <div className="survey-container">
      <h1 className="survey-title">
        Bạn đánh giá trình độ của mình như thế nào?
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

export default Question1;
