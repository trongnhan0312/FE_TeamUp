import React, { useState, useEffect } from "react";
import "./VoucherSelector.scss";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import voucherService from "../../../services/voucherService";

const VoucherSelector = ({ selectedVoucher, onSelectVoucher, pageSize = 5 }) => {
  const [vouchers, setVouchers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        const data = await voucherService.getVouchers(page, pageSize);
        if (data.isSuccessed) {
          setVouchers(data.resultObj.items);
          setTotalPages(data.resultObj.totalPages);
        }
      } catch (error) {
        console.error("Error loading vouchers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="voucher-selector">
      <h4>Chọn mã giảm giá</h4>
      {loading ? (
        <div className="loading">Đang tải voucher...</div>
      ) : vouchers.length === 0 ? (
        <div className="no-voucher">Không có mã giảm giá khả dụng</div>
      ) : (
        <div className="carousel-wrapper">
          <button className="arrow-button left" onClick={handlePrev} disabled={page === 1}>
            <FaChevronLeft />
          </button>
          <div className="voucher-carousel">
            {vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className={`voucher-card ${selectedVoucher?.id === voucher.id ? "selected" : ""}`}
                onClick={() => onSelectVoucher(voucher)}
              >
                <div className="voucher-code">{voucher.code}</div>
                <div className="voucher-desc">{voucher.description}</div>
                <div className="voucher-discount">Giảm {voucher.discountPercent}%</div>
                <div className="voucher-selected-label">Đã chọn</div>
              </div>
            ))}
          </div>
          <button className="arrow-button right" onClick={handleNext} disabled={page === totalPages}>
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default VoucherSelector;
