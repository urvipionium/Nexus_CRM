import { Link, useNavigate } from "react-router-dom";
import logo from "./logo.png";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const handleSubmit = (event: any) => {
    event.preventDefault();
    navigate("/dashboard");
  };
  return (
    <div className="auth-wrapper">
      <div className="bg-blob blob-top" aria-hidden />
      <div className="bg-blob blob-bottom" aria-hidden />

      <div className="auth-card">
        <div className="logo-wrap">
          <div className="logo-circle">
            <img src={logo} alt="Pionium logo" className="logo-image" />
          </div>
          <div className="logo-text">
            <div className="company">Pionium Consultant Pvt Ltd</div>
            <div className="subtitle">EMPLOYEE PORTAL</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="input-label">Employee ID</label>
          <div className="input-with-icon">
            <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <input type="text" placeholder="e.g. EMP001" className="auth-input" />
          </div>

          <label className="input-label">Password</label>
          <div className="input-with-icon">
            <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#9CA3AF" strokeWidth="1.2"/><path d="M7 11V8a5 5 0 0110 0v3" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <input type="password" placeholder="Enter your password" className="auth-input" />
            <button type="button" className="eye-btn" aria-label="toggle password">👁️</button>
          </div>

          <div className="row between">
            <label className="remember"><input type="checkbox" className="mr-2" /> Remember me</label>
            <a className="forgot" href="#">Forgot Password?</a>
          </div>

          <button type="submit" className="primary-btn">Sign In →</button>
        </form>

        <div className="footer-note">Don’t have an account? <Link to="/signup" className="link">Sign up</Link></div>
      </div>
    </div>
  );
};

export default Login;