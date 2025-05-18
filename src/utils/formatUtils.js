// src/utils/formatUtils.js

import { FaStar, FaStarHalfAlt } from "react-icons/fa";

/**
 * Định dạng số thành chuỗi tiền tệ Việt Nam
 * @param {number} price - Số tiền cần định dạng
 * @param {boolean} includeSymbol - Có bao gồm ký hiệu tiền tệ VNĐ hay không
 * @returns {string} Chuỗi đã được định dạng
 */
export const formatPrice = (price, includeSymbol = false) => {
    if (price === null || price === undefined) return "0";

    const formattedPrice = new Intl.NumberFormat("vi-VN").format(price);
    return includeSymbol ? `${formattedPrice} VNĐ` : formattedPrice;
};

/**
 * Định dạng số thành chuỗi có dấu phân cách hàng nghìn
 * @param {number} number - Số cần định dạng
 * @returns {string} Chuỗi đã được định dạng
 */
export const formatNumber = (number) => {
    if (number === null || number === undefined) return "0";
    return new Intl.NumberFormat("vi-VN").format(number);
};

/**
 * Rút gọn số lớn thành K, M, B
 * @param {number} number - Số cần định dạng
 * @returns {string} Chuỗi đã được định dạng rút gọn
 */
export const formatCompactNumber = (number) => {
    if (number === null || number === undefined) return "0";

    if (number < 1000) {
        return number.toString();
    } else if (number < 1000000) {
        return (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    } else if (number < 1000000000) {
        return (number / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    } else {
        return (number / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
    }
};

export const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push(<FaStar key={i} className="star filled" />);
        } else if (i === fullStars && hasHalfStar) {
            stars.push(<FaStarHalfAlt key={i} className="star filled" />);
        } else {
            stars.push(<FaStar key={i} className="star" />);
        }
    }
    return stars;
};

export const getRatingText = (rating) => {
    if (rating >= 4.5) return "Tuyệt vời";
    if (rating >= 4.0) return "Rất tốt";
    if (rating >= 3.5) return "Tốt";
    if (rating >= 3.0) return "Khá";
    return "Trung bình";
};
