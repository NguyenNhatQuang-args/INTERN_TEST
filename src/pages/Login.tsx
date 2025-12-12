import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

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

  // Button styles - reddish walnut color with transparency
  const buttonStyle: React.CSSProperties = {
    height: '45px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 600,
    border: 'none',
    background: 'linear-gradient(135deg, rgba(180, 70, 50, 0.85) 0%, rgba(139, 50, 35, 0.9) 100%)',
    boxShadow: '0 4px 15px rgba(180, 70, 50, 0.3)',
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Panel - Login Form */}
        <div className="login-form-panel">
          <h2 className="login-title">
            Login
          </h2>

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
              style={{ marginBottom: '20px' }}
            >
              <Input 
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,0.5)' }} />} 
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
              style={{ marginBottom: '15px' }}
            >
              <Input.Password 
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,0.5)' }} />} 
                placeholder="Password"
                className="login-input"
              />
            </Form.Item>

            {/* Forgot Password */}
            <div style={{ textAlign: 'right', marginBottom: '25px' }}>
              <a style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '14px',
                textDecoration: 'none'
              }}>
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <Form.Item shouldUpdate style={{ marginBottom: '20px' }}>
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
                    style={buttonStyle}
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
          <p className="welcome-text">
            Don't have an account?
          </p>
          <button 
            className="register-btn"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
          >
            Register
          </button>
        </div>
      </div>

      {/* Global styles + Responsive Media Queries */}
      <style>{`
        /* ============ DESKTOP STYLES ============ */
        .login-container {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          min-height: 100vh;
          background-image: url(https://i.pinimg.com/1200x/5f/d5/9e/5fd59e25dc270ff008d046bc8d180902.jpg);
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding-right: 50px;
          padding-top: 60px;
        }

        .login-card {
          display: flex;
          width: 680px;
          min-height: 420px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .login-form-panel {
          flex: 1;
          background: rgba(30, 30, 40, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 35px 30px;
        }

        .welcome-panel {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 30px;
          color: white;
          text-align: center;
        }

        .login-title {
          font-size: 28px;
          margin-bottom: 40px;
          color: #ffffff;
          font-weight: 700;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .welcome-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 16px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
          color: white;
        }

        .welcome-text {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 25px;
          color: white;
        }

        .register-btn {
          width: 100%;
          height: 45px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.5);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .test-hint {
          text-align: center;
          color: rgba(255,255,255,0.5);
          font-size: 12px;
          margin-top: 20px;
        }

        /* TABLET STYLES (768px - 1024px) */
        @media screen and (max-width: 1024px) {
          .login-container {
            justify-content: center;
            padding-right: 20px;
            padding-left: 20px;
            padding-top: 40px;
          }

          .login-card {
            width: 600px;
            min-height: 400px;
          }

          .login-title {
            font-size: 24px;
            margin-bottom: 30px;
          }

          .welcome-title {
            font-size: 24px;
          }
        }

        /*MOBILE STYLES (< 768px)*/
        @media screen and (max-width: 768px) {
          .login-container {
            justify-content: center;
            align-items: flex-start;
            padding: 20px;
            padding-top: 40px;
            background-position: top center;
          }

          .login-card {
            flex-direction: column;
            width: 100%;
            max-width: 400px;
            min-height: auto;
            border-radius: 12px;
          }

          .login-form-panel {
            order: 1;
            padding: 30px 25px;
          }

          .welcome-panel {
            order: 2;
            padding: 25px 20px;
          }

          .login-title {
            font-size: 22px;
            margin-bottom: 25px;
          }

          .welcome-title {
            font-size: 20px;
            margin-bottom: 12px;
          }

          .welcome-text {
            font-size: 13px;
            margin-bottom: 20px;
          }

          .register-btn {
            height: 40px;
            font-size: 14px;
          }

          .test-hint {
            font-size: 11px;
          }
        }

        /*SMALL MOBILE (< 480px)*/
        @media screen and (max-width: 480px) {
          .login-container {
            padding: 15px;
            padding-top: 30px;
          }

          .login-card {
            max-width: 100%;
            border-radius: 10px;
          }

          .login-form-panel {
            padding: 25px 20px;
          }

          .welcome-panel {
            padding: 20px 15px;
          }

          .login-title {
            font-size: 20px;
            margin-bottom: 20px;
          }

          .welcome-title {
            font-size: 18px;
          }

          .welcome-text {
            font-size: 12px;
          }
        }

        /* INPUT STYLES */
        .ant-input::placeholder,
        .ant-input-password input::placeholder {
          color: rgba(0, 0, 0, 0.4) !important;
        }
        .ant-input,
        .ant-input-affix-wrapper,
        .ant-input-password .ant-input,
        .ant-input-affix-wrapper .ant-input {
          background: rgba(255, 255, 255, 0.9) !important;
          background-color: rgba(255, 255, 255, 0.9) !important;
          color: #000000 !important;
          height: 45px;
          border-radius: 8px;
          border: 1px solid rgba(200, 200, 200, 0.5) !important;
          box-sizing: border-box !important;
        }
        .ant-input-affix-wrapper {
          padding: 0 11px !important;
          height: 45px !important;
          line-height: 43px !important;
        }
        .ant-input-affix-wrapper > input.ant-input {
          background: transparent !important;
          color: #000000 !important;
          height: auto !important;
          border: none !important;
        }
        .ant-input-password .ant-input-suffix {
          color: rgba(0, 0, 0, 0.5);
        }
        .ant-input-password .anticon {
          color: rgba(0, 0, 0, 0.5) !important;
        }
        .ant-form-item-explain-error {
          color: #ff6b6b !important;
        }
        .ant-btn-primary:disabled {
          background: linear-gradient(135deg, rgba(180, 70, 50, 0.85) 0%, rgba(139, 50, 35, 0.9) 100%) !important;
          opacity: 0.5;
          color: white !important;
        }

        .ant-btn-primary:not(:disabled):hover {
          background: linear-gradient(135deg, rgba(200, 85, 60, 0.9) 0%, rgba(160, 60, 45, 0.95) 100%) !important;
          box-shadow: 0 6px 20px rgba(180, 70, 50, 0.4) !important;
        }

        @media screen and (max-width: 768px) {
          .ant-input,
          .ant-input-affix-wrapper,
          .ant-input-password .ant-input {
            height: 42px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
