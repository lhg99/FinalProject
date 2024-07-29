import axiosInstance from './axiosInstance';

export interface SignUpData {
    loginId: string;
    loginPw: string;
    name: string;
    email: string;
    username: string;
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