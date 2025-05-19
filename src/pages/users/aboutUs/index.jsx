import "./style.scss";

export default function AboutUs() {
  return (
    <div className="about-us-wrapper">
      {/* Header */}
      <header className="about-us-header">
        <div className="about-us-header__container">
          <h1 className="about-us-header__title">Giới thiệu về TeamUp</h1>
        </div>
        <div className="about-us-header__light-effect"></div>
      </header>

      {/* Content */}
      <main className="about-us-main">
        <div className="about-us-main__container">
          <div className="about-us-content">
            <p className="about-us-content__paragraph">
              Sứ mệnh của TeamUp là giúp người chơi thể thao kết nối dễ dàng
              hơn, hỗ trợ tìm kiếm sân, đồng đội, huấn luyện viên và cung cấp
              giải pháp quản lý đặt chỗ cho chủ sân. Chúng tôi tận dụng công
              nghệ để tối ưu hóa trải nghiệm thể thao cho mọi người.
            </p>
            <p className="about-us-content__paragraph">
              Tầm nhìn của chúng tôi là trở thành nền tảng kết nối thể thao hàng
              đầu tại Việt Nam (và Đông Nam Á), giúp những người đam mê thể thao
              tìm kiếm và trải nghiệm dịch vụ chất lượng nhất. Đồng thời, TeamUp
              hỗ trợ các chủ sân tối ưu hóa hoạt động kinh doanh của họ.
            </p>

            <div className="about-us-section">
              <p className="about-us-section__title">
                Giá trị cốt lõi của TeamUp bao gồm:
              </p>
              <p className="about-us-section__text">
                Tiện lợi, Chất lượng, Đổi mới sáng tạo, Liên tục cập nhật công
                nghệ, nâng cao tính năng, Hợp tác cùng có lợi,
              </p>

              <p className="about-us-section__text">
                Với các tính năng nổi bật:
              </p>
              <p className="about-us-section__text">
                Bản đồ sân thể thao, Đặt sân tiện lợi, Thanh toán linh hoạt, Kết
                nối đồng đội, huấn luyện, Đánh giá dịch vụ
              </p>

              <p className="about-us-section__text">
                Lợi ích mà TeamUp mang lại:
              </p>
              <p className="about-us-section__text">
                Đối với người chơi: Tiết kiệm thời gian, kết nối dễ dàng, trải
                nghiệm thể thao thuận tiện.
              </p>
              <p className="about-us-section__text">
                Đối với chủ sân: Quản lý sân thông minh, tối ưu hóa kinh doanh,
                thu hút khách hàng hiệu quả.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
