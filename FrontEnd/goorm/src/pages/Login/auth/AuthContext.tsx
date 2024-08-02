import axiosInstance from '../../../api/axiosInstance';
import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';

interface User {
  loginId: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: { loginId: string; loginPw: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      setUser({ loginId: 'exampleLoginId', role });
    }
  }, []);

  const login = async (userData: { loginId: string; loginPw: string }) => {
    const formData = new FormData();
    formData.append('loginId', userData.loginId);
    formData.append('loginPw', userData.loginPw);

    try {
      const response = await axiosInstance.post("/auth/login", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      setUser({ loginId: userData.loginId, role });
    } catch (error: any) {
      alert(error.response ? error.response.data : "로그인 실패");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
