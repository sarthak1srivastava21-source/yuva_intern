import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login/registration logic
    navigate('/dashboard');
  };

  return (
    <div className="landing-container">
      <div className="auth-card animate-fade-in">
        <div className="auth-header">
          <h1>Nexus</h1>
          <p>Connect with the world, instantly.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" className="form-input" placeholder="John Doe" required />
            </div>
          )}
          
          <div className="form-group">
            <label>Username or Email</label>
            <input type="text" className="form-input" placeholder="john@example.com" required />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-input" placeholder="••••••••" required />
          </div>

          <button type="submit" className="auth-btn">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign up' : 'Log in'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Landing;
