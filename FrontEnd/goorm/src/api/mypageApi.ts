import axiosInstance from './axiosInstance';

export interface userData {
    memberName: string;
    memberEmail: string;
    username: string;
    memberRegDate: string;
    memberHeight: number;
    memberWeight: number;
    comment: string;
    memberType: string;
}

export const getusereData = async (): Promise<userData> => { // 기존에 있던 userData[] 에서 배열 삭제를 위해 []를 제거
    try {
        const response = await axiosInstance.get<userData>('/member/get/info');
        console.log(response.data);
        return response.data;
    } catch (err) {
        console.error("failed to get user Data: ", err);
        throw err;
    }
};

export interface ChangeData {
    username: string;
    comment: string;
}

export const postChangeData = async (change: ChangeData): Promise<void> => {
    try {
        const response = await axiosInstance.post<ChangeData>(`/member/change/info`, change);
        console.log("post change success", response.data);
    } catch(err) {
        console.error("failed to post change ", err);
        throw err;
    }
}