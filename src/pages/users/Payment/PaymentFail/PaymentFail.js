import React from "react";
import "./style.scss";

const PaymentFail = () => {
  return (
    <div className="payment-fail-container">
      <div className="icon-fail">
        <svg
          width="100"
          height="100"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vòng tròn bao quanh */}
          <circle cx="32" cy="32" r="30" fill="#FCE7E7" />
          {/* Các chấm tròn 4 góc */}
          <circle cx="32" cy="8" r="6" fill="#FCE7E7" />
          <circle cx="56" cy="32" r="6" fill="#FCE7E7" />
          <circle cx="32" cy="56" r="6" fill="#FCE7E7" />
          <circle cx="8" cy="32" r="6" fill="#FCE7E7" />
          {/* Các vòng nối 4 chấm */}
          <path
            d="M14 32a18 18 0 0136 0"
            stroke="#FCE7E7"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M32 14a18 18 0 010 36"
            stroke="#FCE7E7"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Dấu X */}
          <path
            d="M20 20L44 44M44 20L20 44"
            stroke="#E53935"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="text-fail">THAM GIA KHÔNG THÀNH CÔNG</div>
    </div>
  );
};

export default PaymentFail;
