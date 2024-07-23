import axiosInstance from "../../../api/axiosInstance";

//채팅룸 목록 가져오기
export const getChatRoomsByMember = async (loginId: string) => {
  try {
    const response = await axiosInstance.get(`/chatroom/private/${loginId}`);
    return response.data;
  } catch (error) {
    // console.error('채팅방 불러오기 오류 : chatApi에서 발생', error);
    throw error;
  }
};

//채팅방 히스토리 가져오기
export const getChatHistory = async (chatRoomId: number) => {
    try {
        const response = await axiosInstance.get(`/history/${chatRoomId}`)
        return response.data;
    } catch (error) {
        throw error;
    }
}


