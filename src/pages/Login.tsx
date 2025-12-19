import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Login successful!');
      navigate('/courses');
    } catch (error) {
      message.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Panel - Login Form */}
        <div className="login-form-panel">
          <h2 className="login-title">Login</h2>

          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            {/* Email Field */}
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Email is required!' },
                { type: 'email', message: 'Invalid email format!' }
              ]}
              className="login-form-item"
            >
              <Input 
                prefix={<UserOutlined className="input-icon" />} 
                placeholder="Email"
                className="login-input"
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Password is required!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
              className="login-form-item-password"
            >
              <Input.Password 
                prefix={<LockOutlined className="input-icon" />} 
                placeholder="Password"
                className="login-input"
              />
            </Form.Item>

            {/* Forgot Password */}
            <div className="forgot-password-wrapper">
              <a className="forgot-password-link">Forgot Password?</a>
            </div>

            {/* Submit Button */}
            <Form.Item shouldUpdate className="login-form-item-submit">
              {({ getFieldsError, getFieldsValue }) => {
                const { email, password } = getFieldsValue();
                const hasErrors = getFieldsError().some(({ errors }) => errors.length > 0);
                const isIncomplete = !email || !password;
                return (
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    disabled={hasErrors || isIncomplete}
                    block
                    className="login-button"
                  >
                    Login
                  </Button>
                );
              }}
            </Form.Item>
          </Form>

          {/* Test account hint */}
          <p className="test-hint">
            Test: emily.johnson@x.dummyjson.com / emilyspass
          </p>
        </div>

        {/* Right Panel - Welcome */}
        <div className="welcome-panel">
          <h1 className="welcome-title">
            Hello, Welcome To<br />Course Management!
          </h1>
          <p className="welcome-text">Don't have an account?</p>
          <button className="register-btn">Register</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
