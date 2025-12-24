import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, JwtPayload } from '../types';
import { API_CONFIG, COOKIE_KEYS, COOKIE_OPTIONS, TOKEN_EXPIRY } from '../constants';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isTokenExpired: () => boolean;
  refreshAccessToken: () => Promise<boolean>;
  getAccessToken: () => string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => 
{
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Lấy access token từ cookie
  const getAccessToken = useCallback((): string | undefined => 
  {
    return Cookies.get(COOKIE_KEYS.ACCESS_TOKEN);
  }, []);

  // Kiểm tra token có hết hạn không
  const isTokenExpired = useCallback((): boolean => 
  {
    const token = Cookies.get(COOKIE_KEYS.ACCESS_TOKEN);
    if (!token) return true;

    try 
    {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      
      // Thêm buffer 60 giây để refresh sớm
      return decoded.exp < currentTime + 60;
    } catch 
    {
      return true;
    }
  }, []);

  // Decode token để lấy thông tin
  const decodeToken = (token: string): JwtPayload | null => 
  {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  // Logout function
  const logout = useCallback(() => 
  {
    Cookies.remove(COOKIE_KEYS.ACCESS_TOKEN);
    Cookies.remove(COOKIE_KEYS.REFRESH_TOKEN);
    Cookies.remove(COOKIE_KEYS.USER);
    setUser(null);
  }, []);

  // Refresh access token
  const refreshAccessToken = useCallback(async (): Promise<boolean> => 
  {
    const refreshToken = Cookies.get(COOKIE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_CONFIG.AUTH_API_URL}/auth/refresh`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
      });

      if (!response.ok) 
      {
        logout();
        return false;
      }

      const data = await response.json();
      
      // Cập nhật access token mới
      Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, data.accessToken, 
      {
        ...COOKIE_OPTIONS,
        expires: TOKEN_EXPIRY.ACCESS_TOKEN,
      });
      
      // Cập nhật refresh token nếu có
      if (data.refreshToken) 
      {
        Cookies.set(COOKIE_KEYS.REFRESH_TOKEN, data.refreshToken, 
        {
          ...COOKIE_OPTIONS,
          expires: TOKEN_EXPIRY.REFRESH_TOKEN,
        });
      }

      console.log('Token refreshed successfully');
      return true;
    } catch (error) 
    {
      console.error('Failed to refresh token:', error);
      logout();
      return false;
    }
  }, [logout]);

  useEffect(() => 
  {
    // Kiểm tra token trong cookies khi app load
    const token = Cookies.get(COOKIE_KEYS.ACCESS_TOKEN);
    const savedUser = Cookies.get(COOKIE_KEYS.USER);
    
    if (token && savedUser) 
    {
      // Kiểm tra token có hết hạn không
      if (!isTokenExpired()) 
      {
        try 
        {
          setUser(JSON.parse(savedUser));
          
          // Log token info
          const decoded = decodeToken(token);
          if (decoded) 
          {
            console.log('Token valid until:', new Date(decoded.exp * 1000));
          }
        } catch 
        {
          logout();
        }
      } else 
      {
        // Thử refresh token
        refreshAccessToken().then((success) => 
        {
          if (success && savedUser) 
          {
            try 
            {
              setUser(JSON.parse(savedUser));
            } catch 
            {
              logout();
            }
          }
        });
      }
    }
    setLoading(false);
  }, [isTokenExpired, logout, refreshAccessToken]);

  const login = async (email: string, password: string) => 
  {
    const authApiUrl = API_CONFIG.AUTH_API_URL;
    
    // Bước 1: Tìm user bằng email từ API users
    const usersResponse = await fetch(`${authApiUrl}/users/filter?key=email&value=${email}`);
    
    if (!usersResponse.ok) 
    {
      throw new Error('Invalid credentials');
    }

    const usersData = await usersResponse.json();
    
    if (!usersData.users || usersData.users.length === 0) 
    {
      throw new Error('Invalid credentials');
    }

    const username = usersData.users[0].username;

    // Bước 2: Login bằng username tìm được
    const response = await fetch(`${authApiUrl}/auth/login`, 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, expiresInMins: 30 })
    });

    if (!response.ok) 
    {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    
    // Decode token để xem thông tin
    const decoded = decodeToken(data.accessToken);
    if (decoded) 
    {
      console.log('Login successful!');
      console.log('Token expires at:', new Date(decoded.exp * 1000));
    }
    
    // Lưu access token vào cookie (30 phút)
    Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, data.accessToken, 
    {
      ...COOKIE_OPTIONS,
      expires: TOKEN_EXPIRY.ACCESS_TOKEN,
    });
    
    // Lưu refresh token vào cookie (7 ngày)
    Cookies.set(COOKIE_KEYS.REFRESH_TOKEN, data.refreshToken, 
    {
      ...COOKIE_OPTIONS,
      expires: TOKEN_EXPIRY.REFRESH_TOKEN,
    });
    
    // Tạo user info object
    const userInfo: User = 
    {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
    
    // Lưu user info vào cookie
    Cookies.set(COOKIE_KEYS.USER, JSON.stringify(userInfo), 
    {
      ...COOKIE_OPTIONS,
      expires: TOKEN_EXPIRY.REFRESH_TOKEN,
    });
    
    setUser(userInfo);
  };

  return (
    <AuthContext.Provider value=
    {{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout,
      loading,
      isTokenExpired,
      refreshAccessToken,
      getAccessToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => 
{
  const context = useContext(AuthContext);
  if (!context) 
  {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
