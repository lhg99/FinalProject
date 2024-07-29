import axios, { AxiosResponse } from 'axios';

export interface LoginData {
    loginId: string;
    loginPw: string;
}

export interface LoginRequest {
    message: string;
    memberId: string;
    info: string;
}

export const postLoginData = async (login: LoginData): Promise<LoginRequest> => {
    const formData = new FormData();
    formData.append('loginId', login.loginId);
    formData.append('loginPw', login.loginPw);

    try {
        const response: AxiosResponse<LoginRequest> = await axios.post("http://final-project-app-env.eba-xdjqmujd.ap-northeast-2.elasticbeanstalk.com/api/auth/login", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });

        if (response.status === 200) {
            console.log("로그인 성공:", response.data);
            return response.data;
        } else {
            throw new Error("로그인 실패: 예상치 못한 상태 코드");
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("로그인 실패:", error.response?.data);
            throw new Error("로그인 실패: " + error.response?.data);
        } else {
            console.error("로그인 실패:", error);
            throw new Error("로그인 실패: 알 수 없는 오류");
        }
    }
}
