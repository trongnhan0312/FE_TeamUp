import React from "react";
import "./style.scss";

const PaymentSuccessCoach = () => {
  return (
    <div className="payment-success-container">
      <div className="icon-check">
        <svg
          width="100"
          height="100"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vòng tròn bao quanh */}
          <circle cx="32" cy="32" r="30" fill="#EAF5D3" />
          {/* Các chấm tròn 4 góc */}
          <circle cx="32" cy="8" r="6" fill="#EAF5D3" />
          <circle cx="56" cy="32" r="6" fill="#EAF5D3" />
          <circle cx="32" cy="56" r="6" fill="#EAF5D3" />
          <circle cx="8" cy="32" r="6" fill="#EAF5D3" />
          {/* Các vòng nối 4 chấm */}
          <path
            d="M14 32a18 18 0 0136 0"
            stroke="#EAF5D3"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M32 14a18 18 0 010 36"
            stroke="#EAF5D3"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Dấu tick */}
          <path
            d="M20 33L28 41L44 25"
            stroke="#9BCB00"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="text-success">THAM GIA THÀNH CÔNG</div>
    </div>
  );
};

export default PaymentSuccessCoach;
