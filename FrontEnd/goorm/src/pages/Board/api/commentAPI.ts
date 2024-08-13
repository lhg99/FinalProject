import axiosInstance from '../../../api/axiosInstance';
import { Comment } from '../types';

// 댓글 목록 조회
export const fetchComments = async (boardId: string): Promise<Comment[]> => {
    try {
      console.log('Fetching comments for board ID:', boardId);
      const response = await axiosInstance.get(`/comment/list/${boardId}`);
      console.log('Fetched comments:', response.data.comments);
      return Array.isArray(response.data.comments) ? response.data.comments : [];
    } catch (error) {
      console.error('댓글 목록 조회 에러:', error);
      return [];
    }
  };
  
  // 댓글 추가
  export const addComment = async (postData: { boardId: number; commentContent: string; writer: string }): Promise<any> => {
    try {
      console.log('Adding comment with data:', postData);
      const response = await axiosInstance.post('/comment/save', postData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Added comment:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };
  
  // 댓글 삭제
  export const deleteComment = async (commentId: string): Promise<any> => {
    try {
      console.log('Deleting comment with ID:', commentId);
      await axiosInstance.post(`/comment/delete/${commentId}`);
      console.log('Deleted comment successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  };
  
  // 댓글 수정
  export const updateComment = async (commentData: { commentId: number; commentContent: string }): Promise<any> => {
    try {
      console.log('Updating comment with data:', commentData);
      const response = await axiosInstance.post('/comment/update', commentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Updated comment:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  };