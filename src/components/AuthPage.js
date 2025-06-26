import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AuthPage.css';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      setErrors({});
      
      try {
        const endpoint = isLogin ? '/api/login' : '/api/register';
        const payload = isLogin
          ? { email: formData.email, password: formData.password }
          : { name: formData.name, email: formData.email, password: formData.password };
        
        const response = await fetch(`http://localhost:5000${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        
        if (isLogin) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log('Login successful:', data.user);
          navigate('/dashboard');
        } else {
          setIsLogin(true);
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
          setErrors({ success: 'Registration successful! Please log in.' });
        }
      } catch (error) {
        setErrors({ general: error.message });
        setShake(true);
        setTimeout(() => setShake(false), 500);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setShake(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${isLogin ? 'login-mode' : 'register-mode'} ${shake ? 'shake' : ''}`}>
        <div className="auth-header">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          <div className="auth-toggle">
            <button 
              onClick={toggleAuthMode}
              className="btn btn-link"
            >
              {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="alert alert-danger" role="alert">
              {errors.general}
            </div>
          )}
          {errors.success && (
            <div className="alert alert-success" role="alert">
              {errors.success}
            </div>
          )}

          {!isLogin && (
            <div className="form-group mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Enter your name"
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
          )}

          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter your password"
              />
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlash /> : <Eye />}
              </button>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
          </div>

          {!isLogin && (
            <div className="form-group mb-4">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Confirm your password"
                />
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeSlash /> : <Eye />}
                </button>
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>
            </div>
          )}

          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="btn btn-primary auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {isLogin ? 'Logging in...' : 'Registering...'}
                </>
              ) : (
                isLogin ? 'Login' : 'Register'
              )}
            </button>
          </div>

          {isLogin && (
            <div className="text-center mt-3">
              <a href="/forgot-password" className="text-muted">Forgot password?</a>
            </div>
          )}
        </form>
      </div>

      <div className="auth-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
    </div>
  );
};

export default AuthPage;