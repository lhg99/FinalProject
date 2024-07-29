import axiosInstance from "../../../api/axiosInstance";

//1:1 채팅방 목록 가져오기
export const getPrivateChatRoomsByMember = async (loginId: string) => {
   try {
      const response = await axiosInstance.get(`/chatroom/private/${loginId}`);
      return response.data;
   } catch (error) {
      // console.error('채팅방 불러오기 오류 : chatApi에서 발생', error);
      throw error;
   }
};

//오픈채팅 목록 가져오기
export const getPublicChatRoomsByMember = async (loginId: string) => {
   try {
      const response = await axiosInstance.get(`/chatroom/public/${loginId}`);
      return response.data;
   } catch (error) {
      throw error;
   }
};

//참여하지 않은 오픈채팅방 목록 가져오기
export const getPublicChatRoom = async (loginId: string) => {
   try {
      const response = await axiosInstance.get(
         `/chatroom/public/list/${loginId}`
      );
      return response.data;
   } catch (error) {
      throw error;
   }
};

//채팅방 히스토리 가져오기
export const getChatHistory = async (chatRoomId: number) => {
   try {
      const response = await axiosInstance.get(`/history/${chatRoomId}`);
      return response.data;
   } catch (error) {
      throw error;
   }
};

//채팅방 참여하기
export const joinChatRoom = async (chatRoomId: number) => {
   try {
      const response = await axiosInstance.post(`/chatroom/join`, {
         chatRoomId
      });
      return response.data;
   } catch (error) {
      throw error;
   }
};

//채팅방 만들기
export const createChatRoom = async (
   chatRoomName: string,
   chatRoomType: string
) => {
   try {
      const response = await axiosInstance.post(`/chatroom`, {
         chatRoomName,
         chatRoomType,
      });
      return response.data;
   } catch (error) {
      throw error;
   }
};
