import axiosInstance from "../../../../api/axiosInstance";

export const getChatRoomsByMember = async (loginId: string) => {
  try {
    const response = await axiosInstance.get(`/members/${loginId}/chatrooms`);
    return response.data;
  } catch (error) {
    // console.error('채팅방 불러오기 오류 : chatApi에서 발생', error);
    throw error;
  }
};


