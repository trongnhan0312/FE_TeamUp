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
      <div className="blog-container">
        <main className="main-content">
          <article className="article" style={{ background: "#ffffff" }}>
            <section className="racket-comparison">
              <div className="title-wrapper">
                <h1 className="main-title">
                  So sánh vợt cầu lông Yonex & Victor
                </h1>
                <p className="subtitle">Những gợi ý cho người mới bắt đầu</p>
              </div>

              <div className="rackets-container">
                <div className="racket-item">
                  <div className="racket-card">
                    <img
                      src={racket || "/placeholder.svg"}
                      alt="Vợt cầu lông"
                      className="racket-image"
                    />
                    <div className="racket-overlay">
                      <h3>Vợt Chuyên Nghiệp</h3>
                      <p>Phù hợp cho mọi trình độ</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="clothing-section">
              <div className="section-header">
                <h2 className="section-title">Quần Áo Chơi Cầu Lông</h2>
                <p className="section-description">
                  Mặc gì để thoải mái & linh hoạt?
                </p>
              </div>

              <div className="clothing-grid">
                <div className="clothing-item">
                  <div className="clothing-card">
                    <img
                      src={cloth1 || "/placeholder.svg"}
                      alt="Trang phục cầu lông nữ"
                      className="clothing-image"
                    />
                    <div className="clothing-info">
                      <h4>Trang phục nữ</h4>
                      <p>Thiết kế năng động</p>
                    </div>
                  </div>
                </div>
                <div className="clothing-item">
                  <div className="clothing-card">
                    <img
                      src={cloth2 || "/placeholder.svg"}
                      alt="Trang phục cầu lông nam"
                      className="clothing-image"
                    />
                    <div className="clothing-info">
                      <h4>Trang phục nam</h4>
                      <p>Chất liệu thoáng mát</p>
                    </div>
                  </div>
                </div>
                <div className="clothing-item">
                  <div className="clothing-card">
                    <img
                      src={cloth3 || "/placeholder.svg"}
                      alt="Trang phục cầu lông chuyên nghiệp"
                      className="clothing-image"
                    />
                    <div className="clothing-info">
                      <h4>Trang phục chuyên nghiệp</h4>
                      <p>Công nghệ hiện đại</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="similar-courts-wrapper">
                <SimilarCourts />
              </div>
            </section>
          </article>
        </main>

        <aside className="sidebar">
          <div className="sidebar-header">
            <h3 className="sidebar-title">Bài viết liên quan</h3>
            <div className="sidebar-divider"></div>
          </div>

          <div className="related-articles">
            {titles.map((title, idx) => (
              <article
                key={idx}
                className="related-article"
                onClick={handleRedirect(urls[idx])}
              >
                <div className="article-content">
                  <h4 className="article-title">{title}</h4>
                  <span className="read-more">Đọc thêm →</span>
                </div>
                <div className="article-image">
                  <img src={images[idx] || "/placeholder.svg"} alt={title} />
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Blog;
