import "./style.scss";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-wrapper">
      {/* Header */}
      <header className="privacy-header">
        <div className="privacy-header__container">
          <h1 className="privacy-header__title">Chính Sách Bảo Mật</h1>
        </div>
        <div className="privacy-header__light-effect"></div>
      </header>

      {/* Content */}
      <main className="privacy-main">
        <div className="privacy-main__container">
          <div className="privacy-content">
            <p className="privacy-content__paragraph">
              Chúng tôi cam kết bảo vệ quyền riêng tư của người dùng và chính vì
              thế Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử
              dụng và bảo vệ dữ liệu của bạn khi sử dụng các dịch vụ của chúng
              tôi.
            </p>

            <div className="privacy-section">
              <p className="privacy-section__title">
                1. Thông Tin Chúng Tôi Thu Thập
              </p>
              <p className="privacy-section__title">1.1 Thông Tin Cá Nhân</p>
              <p className="privacy-section__text">
                Chúng tôi có thể thu thập các thông tin cá nhân khi bạn đăng ký
                tài khoản hoặc sử dụng dịch vụ, bao gồm:
              </p>
              <p className="privacy-section__item">- Họ và tên</p>
              <p className="privacy-section__item">- Địa chỉ email</p>
              <p className="privacy-section__item">- Số điện thoại</p>
              <p className="privacy-section__item">- Hình ảnh hồ sơ</p>
              <p className="privacy-section__item">- Khu vực huấn luyện</p>
            </div>

            <div className="privacy-section">
              <p className="privacy-section__title">1.2 Dữ Liệu Sử Dụng</p>
              <p className="privacy-section__text">
                Chúng tôi có thể thu thập dữ liệu về cách bạn sử dụng nền tảng,
                bao gồm:
              </p>
              <p className="privacy-section__item">
                - Lịch sử đặt lịch huấn luyện
              </p>
              <p className="privacy-section__item">
                - Tương tác với học viên/huấn luyện viên
              </p>
              <p className="privacy-section__item">- Lịch sử thanh toán</p>
              <p className="privacy-section__item">
                - Địa chỉ IP loại, loại trình duyệt và thiết bị
              </p>
            </div>

            <div className="privacy-section">
              <p className="privacy-section__title">
                2. Cách chúng tôi sử dụng thông tin
              </p>
              <p className="privacy-section__text">
                Thông tin thu thập được sử dụng đểđể:
              </p>
              <p className="privacy-section__item">
                - Cung cấp và quản lý dịch vụ huấn luyện
              </p>
              <p className="privacy-section__item">
                - Xác minh danh tính người dùng
              </p>
              <p className="privacy-section__item">
                - Cải thiện trải nghiệm sử dụng
              </p>
              <p className="privacy-section__item">
                - Hỗ trợ và chăm sóc khách hàng
              </p>
              <p className="privacy-section__item">
                - Phòng chống gian lận và bảo vệ an toàn dữ liệu
              </p>
            </div>

            <div className="privacy-section">
              <p className="privacy-section__title">3. Chia Sẻ Thông Tin</p>
              <p className="privacy-section__text">
                Chúng tôi cam kết không bán hoặc chia sẻ thông tin cá nhân của
                bạn với bên thứ ba ngoại trừ:
              </p>
              <p className="privacy-section__item">
                - Khi có yêu cầu từ cơ quan pháp luật
              </p>
              <p className="privacy-section__item">
                - Khi cần thiết để cung cấp dịch vụ (ví dụ: xử lý thanh toán qua
                đối tác tài chính)
              </p>
              <p className="privacy-section__item">
                - Khi bạn đồng ý chia sẻ thông tin với bên thứ ba
              </p>
            </div>

            <div className="privacy-section">
              <p className="privacy-section__title">4. Bảo Mật Dữ Liệu</p>
              <p className="privacy-section__text">
                Chúng tôi áp dụng các biện pháp bảo mật cao để bảo vệ thông tin
                cá nhân của bạn khỏi mất, truy cập trái phép hoặc làm dụng, bao
                gồm:
              </p>
              <p className="privacy-section__item">- Mã hóa dữ liệu</p>
              <p className="privacy-section__item">
                - Xác thực hai yếu tố (2FA)
              </p>
              <p className="privacy-section__item">
                - Kiểm tra bảo mật định kỳ
              </p>
            </div>

            <div className="privacy-section">
              <p className="privacy-section__title">
                5. Quyền Lợi Của Người Dùng
              </p>
              <p className="privacy-section__text">Bạn có quyền:</p>
              <p className="privacy-section__item">
                - Kiểm tra, chỉnh sửa hoặc xóa thông tin cá nhân của mình
              </p>
              <p className="privacy-section__item">
                - Yêu cầu ngừng sử dụng hoặc xóa tài khoản
              </p>
              <p className="privacy-section__item">
                - Hạn chế hoặc phản đối việc xử lý dữ liệu cá nhân
              </p>
            </div>

            <div className="privacy-section">
              <p className="privacy-section__title">6. Liên hệ</p>
              <p className="privacy-section__text">
                Nếu bạn có bất kỳ thắc mắc về chính sách bảo mật này, vui lòng
                liên hệ với chúng tôi qua:{" "}
                <a
                  href="mailto:support@tennistraining.vn"
                  className="privacy-section__link"
                >
                  Email: support@tennistraining.vn
                </a>{" "}
                | Hotline: 0123 456 789
              </p>
            </div>

            <div className="privacy-section">
              <p className="privacy-section__text">
                Bằng việc sử dụng nền tảng của chúng tôi, bạn đồng ý với các
                điều khoản trong chính sách bảo mật này.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
