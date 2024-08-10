import axios from 'axios';
import axiosInstance from './axiosInstance';

export interface SignUpData {
    loginId: string;
    loginPw: string;
    name: string;
    email: string;
    username: string;
}

export interface KakaoSignupData {
    loginId: string;
    loginPw: string;
    name: string;
}


export const postSignUpData = async (signup: SignUpData): Promise<void> => {
    try {
        const response = await axiosInstance.post<SignUpData[]>(`/member/signup`, signup);
        console.log("post signup success", response.data);
    } catch(err) {
        console.error("failed to post signup ", err);
        throw err;
    }
}

export const postKakaoSignup = async (data: KakaoSignupData) => {
    const params = {
        loginId: data.loginId,
        loginPw: data.loginPw,
        name: data.name
    }
    try {
        const response = await axiosInstance.post("/member/oauth/signup", { params });
        console.log("카카오 회원가입 성공", response.data);
        return response.data;
    } catch (error) {
        console.error("카카오 회원가입 실패", error);
    }
}