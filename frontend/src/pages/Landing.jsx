import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSubmitting(true);

    try {
      if (isLogin) {
        const res = await login({
          email: email.trim(),
          password,
        });
        if (res.success) {
          navigate('/dashboard');
        } else {
          setLocalError(res.message || 'Login failed. Please verify credentials.');
        }
      } else {
        const res = await register({
          username: username.trim(),
          email: email.trim(),
          password,
        });
        if (res.success) {
          navigate('/dashboard');
        } else {
          setLocalError(res.message || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setLocalError(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="landing-container">
      <div className="auth-card animate-fade-in">
        <div className="auth-header">
          <h1>Nexus</h1>
          <p>Connect with the world, instantly.</p>
        </div>

        {localError && (
          <div className="auth-error-banner animate-fade-in">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="sarthak_dev"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>{isLogin ? 'Email or Username' : 'Email Address'}</label>
            <input
              type={isLogin ? 'text' : 'email'}
              className="form-input"
              placeholder={isLogin ? 'sarthak@nexus.dev' : 'name@example.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={submitting}>
            {submitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setLocalError('');
            }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Landing;
