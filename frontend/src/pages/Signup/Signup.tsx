import { Link, useNavigate } from "react-router-dom";
import logo from "./logo.png";
import "../login/login.css";


const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    navigate('/dashboard');
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
          <label className="input-label">Full name</label>
          <div className="input-with-icon">
            <input className="auth-input" placeholder="Your full name" />
          </div>

          <label className="input-label">Employee ID</label>
          <div className="input-with-icon">
            <input className="auth-input" placeholder="e.g. EMP001" />
          </div>

          <label className="input-label">Password</label>
          <div className="input-with-icon">
            <input type="password" className="auth-input" placeholder="Create a password" />
          </div>

          <button className="primary-btn" type="submit">Create account</button>
        </form>

        <div className="footer-note">
          Already have an account? <Link to="/login" className="link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
