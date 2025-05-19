import "./style.scss";

import racket from "../../../assets/user/badminton-racket.png";
import blog1 from "../../../assets/user/blog1.png";
import blog2 from "../../../assets/user/blog2.png";
import blog3 from "../../../assets/user/blog3.png";
import blog4 from "../../../assets/user/blog4.png";
import cloth1 from "../../../assets/user/cloth1.png";
import cloth2 from "../../../assets/user/cloth2.png";
import cloth3 from "../../../assets/user/cloth3.png";
import SimilarCourts from "../courts/court_detail/SimilarCourts";

const Blog = () => {
  const urls = [
    "https://shopvnb.com/cach-chon-qua-cau-long.html",
    "https://shopvnb.com/quan-can-vot-cau-long-bang-vai.html",
    "https://hvshop.vn/lee-chong-wei-vs-lin-dan/",
    "https://donglucsport.vn/blogs/news/sai-lam-khi-chon-giay-cau-long-nhieu-nguoi-mac-phai-bi-quyet-len-le",
  ];

  const titles = [
    "Cách Chọn Cầu Lông Phù Hợp: Lông Vịt, Lông...",
    "Lựa chọn khăn quấn cán vợt cầu lông",
    "So Sánh Những Cuộc Đối Đầu Giữa Lin Dan và Lee Chong Wei, Ai Xuất Sắc Hơn?",
    "Những Sai Lầm Khi Chọn Giày Cầu Lông Khiến Bạn Dễ Chấn Thương",
  ];

  const images = [blog1, blog2, blog3, blog4];

  const handleRedirect = (url) => () => {
    window.location.href = url;
  };

  return (
    <div className="blog-page">
      <div className="container">
        <main className="main-content">
          <article className="article">
            <section className="racket-comparison">
              <h1 className="main-title">
                So sánh vợt cầu lông Yonex & Victor : Những gợi ý cho người mới
                bắt đầu
              </h1>

              <div className="rackets-container">
                <div className="racket-item">
                  <img
                    src={racket}
                    alt="Vợt cầu lông"
                    className="racket-image"
                  />
                </div>
              </div>
            </section>

            <section className="clothing-section">
              <h2 className="section-title">
                Quần Áo Chơi Cầu Lông: Mặc Gì Để Thoải Mái & Linh Hoạt?
              </h2>

              <div className="clothing-images">
                <div className="clothing-item">
                  <img
                    src={cloth1}
                    alt="Trang phục cầu lông nữ"
                    className="clothing-image"
                  />
                </div>
                <div className="clothing-item">
                  <img
                    src={cloth2}
                    alt="Trang phục cầu lông nam"
                    className="clothing-image"
                  />
                </div>
                <div className="clothing-item">
                  <img
                    src={cloth3}
                    alt="Trang phục cầu lông chuyên nghiệp"
                    className="clothing-image"
                  />
                </div>
              </div>
            </section>

            <SimilarCourts />
          </article>
        </main>

        <aside className="sidebar">
          <div className="related-articles">
            {titles.map((title, idx) => (
              <div
                key={idx}
                className="related-article"
                onClick={handleRedirect(urls[idx])}
                style={{ cursor: "pointer" }}
              >
                <div className="article-content">
                  <h4 className="article-title">{title}</h4>
                </div>
                <div className="article-image">
                  <img src={images[idx]} alt={title} />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Blog;
