
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../component/common/theme/footer';
import './LoginPage.scss';
import loginImg from '../../assets/user/login.png';
import { ROUTER } from '../../utils/router';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your login logic here
    console.log('Login attempt with:', { email, password, rememberMe });
  };

  return (
    <div className="login-page">
      {/* Main content */}
      <div className="login-container">
        {/* Login Form */}
        <div className="login-form-container">
          <h1 className="login-title">Đăng nhập</h1>
          
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email field */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email"
                placeholder="john.doe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {/* Password field */}
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="password-input">
                <input 
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* Remember me and Forgot password */}
            <div className="form-options">
              <div className="remember-me">
                <input 
                  type="checkbox" 
                  id="rememberMe" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Ghi nhớ</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">Quên mật khẩu</Link>
            </div>
            
            {/* Login button */}
            <button type="submit" className="login-button">
              Đăng nhập
            </button>
            
            {/* Sign up link */}
            <div className="signup-link">
                Người dùng mới ? <Link to={ROUTER.AUTH.REGISTER}>Đăng ký ngay</Link>
            </div>
          </form>
          
          {/* Divider with text */}
          <div className="login-divider">
            <span>Đăng nhập với</span>
          </div>
          
          {/* Social login */}
          <div className="social-login">
            {/* <button className="social-button facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button> */}
             <button className="social-button google">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </button>
            {/* <button className="social-button apple">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.5-1.09-.4-2.08-.42-3.2 0-1.43.56-2.18.44-3.08-.5-4.64-4.75-3.84-13.14 1.74-13.3.79.01 1.34.27 1.84.27.48 0 1.4-.34 2.35-.28.4.01 1.52.16 2.25.66-1.96 1.26-1.64 4.51.32 5.32-1.27 3.96 1.07 8.14 3.08 7.85-.33.73-.74 1.44-1.17 1.99l.01-.02zm-2.21-17.42c.88-1.07.81-2.57.65-2.86-1.23.06-2.65.87-3.24 1.81-.61.84-.78 1.74-.71 2.71 1.32.04 2.7-.73 3.3-1.66z" fill="#000000" />
              </svg>
            </button> */}
          </div>
        </div>
        
        {/* Image */}
        <div className="login-image">
          <div className="image-container">
            <img
              src={loginImg}
              alt="Badminton rackets and shuttlecocks"
            />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LoginPage;