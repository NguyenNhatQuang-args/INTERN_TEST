import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { API_CONFIG, STORAGE_KEYS } from '../constants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra token trong localStorage khi app load
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const authApiUrl = API_CONFIG.AUTH_API_URL;
    
    // Bước 1: Tìm user bằng email từ API users
    const usersResponse = await fetch(`${authApiUrl}/users/filter?key=email&value=${email}`);
    
    if (!usersResponse.ok) {
      throw new Error('Invalid credentials');
    }

    const usersData = await usersResponse.json();
    
    if (!usersData.users || usersData.users.length === 0) {
      throw new Error('Invalid credentials');
    }

    const username = usersData.users[0].username;

    // Bước 2: Login bằng username tìm được
    const response = await fetch(`${authApiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, expiresInMins: 30 })
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    
    // Lưu token và user info
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.accessToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
