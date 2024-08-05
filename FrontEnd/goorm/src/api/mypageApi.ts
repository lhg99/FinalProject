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

export const getusereData = async (): Promise<userData[]> => {
    try {
        const response = await axiosInstance.get<userData[]>('/member/get/info');
        console.log(response.data);
        return response.data;
    } catch (err) {
        console.error("failed to get user Data: ", err);
        throw err;
    }
};