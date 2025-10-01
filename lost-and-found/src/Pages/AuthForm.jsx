import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../api'; // Import API functions
import './AuthForm.css';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!loginData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(loginData.email)) newErrors.email = 'Please enter a valid email';
    if (!loginData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!signupData.name) newErrors.name = 'Name is required';
    if (!signupData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(signupData.email)) newErrors.email = 'Please enter a valid email';
    if (!signupData.password) newErrors.password = 'Password is required';
    else if (signupData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (signupData.password !== signupData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const { data } = await login(loginData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ form: 'Invalid credentials. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;
    setLoading(true);
    try {
      const { data } = await signup({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      setErrors({ form: 'Could not create account. The email might already be in use.' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
    if (errors[name] || errors.form) {
      setErrors(prev => ({ ...prev, [name]: '', form: '' }));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-toggle">
          <button
            className={`toggle-btn ${!isSignUp ? 'active' : ''}`}
            onClick={() => { setIsSignUp(false); setErrors({}); }}
            type="button"
          >
            Login
          </button>
          <button
            className={`toggle-btn ${isSignUp ? 'active' : ''}`}
            onClick={() => { setIsSignUp(true); setErrors({}); }}
            type="button"
          >
            Sign Up
          </button>
          <div className={`toggle-indicator ${isSignUp ? 'signup' : ''}`}></div>
        </div>

        <div className="form-container">
          <div className={`form-wrapper ${isSignUp ? 'signup' : ''}`}>
            {/* Login Form */}
            <div className="form-section">
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">Sign in to your account</p>
              
              <form onSubmit={handleLogin}>
                {errors.form && <div className="error-message" style={{textAlign: 'center', opacity: 1, marginBottom: '1rem'}}>{errors.form}</div>}
                <div className="form-group">
                  <label className="form-label" htmlFor="login-email">Email</label>
                  <input
                    id="login-email" name="email" type="email"
                    value={loginData.email} onChange={handleInputChange(setLoginData)}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="login-password">Password</label>
                  <input
                    id="login-password" name="password" type="password"
                    value={loginData.password} onChange={handleInputChange(setLoginData)}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                  />
                  {errors.password && <div className="error-message">{errors.password}</div>}
                </div>

                <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
                  {loading ? '' : 'Sign In'}
                </button>

                <div className="forgot-password">
                  <a href="#" className="forgot-link">Forgot your password?</a>
                </div>
              </form>
            </div>

            {/* Signup Form */}
            <div className="form-section">
              <h2 className="form-title">Create Account</h2>
              <p className="form-subtitle">Join us today</p>
              
              <form onSubmit={handleSignup}>
                {errors.form && <div className="error-message" style={{textAlign: 'center', opacity: 1, marginBottom: '1rem'}}>{errors.form}</div>}
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-name">Full Name</label>
                  <input
                    id="signup-name" name="name" type="text"
                    value={signupData.name} onChange={handleInputChange(setSignupData)}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <div className="error-message">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-email">Email</label>
                  <input
                    id="signup-email" name="email" type="email"
                    value={signupData.email} onChange={handleInputChange(setSignupData)}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-password">Password</label>
                  <input
                    id="signup-password" name="password" type="password"
                    value={signupData.password} onChange={handleInputChange(setSignupData)}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Create a password"
                  />
                  {errors.password && <div className="error-message">{errors.password}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
                  <input
                    id="signup-confirm" name="confirmPassword" type="password"
                    value={signupData.confirmPassword} onChange={handleInputChange(setSignupData)}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                </div>

                <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
                  {loading ? '' : 'Create Account'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;