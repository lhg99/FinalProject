import axiosInstance from '../../../api/axiosInstance';
import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';

interface User {
  memberId: string;
  info: string; // 로그인 상태에 대한 정보 (예: "false" 등)
  message: string; // 메시지 ("로그인이 정상적으로 완료되었습니다" 등)
}

interface AuthContextType {
  user: User;
  login: (userData: { loginId: string; loginPw: string }) => Promise<void>;
  logout: () => void;
  isLoggedIn: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const initialUser = {
    memberId: "",
    info: "",
    message: ""
  };
  const [user, setUser] = useState<User>(initialUser);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    console.log("storedUser: ", storedUser);
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

      const { info, memberId, message } = response.data;
      console.log("response 정보: ", response.data);
      const user = { memberId, info, message };
      sessionStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      console.log("세션스토리지 유저 정보", user);
    } catch (error: any) {
      alert(error.response ? error.response.data : "로그인 실패");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    setUser(initialUser);  // 초기값으로 설정
  };

  const isLoggedIn = () => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const result = user.message.includes("로그인이 정상적으로 완료되었습니다");
        resolve(result);
      }, 2000); // 2초 시간
    });
  };

  useEffect(() => {
    console.log("현재 로그인 상태:", isLoggedIn());
  }, [user]);

  const value = { user, login, logout, isLoggedIn };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;