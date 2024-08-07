import axiosInstance from '../../../api/axiosInstance';
import { Comment } from '../types';
import axios from 'axios';

// 게시글 목록 조회
export const fetchPosts = async (
  boardType: string,
  page: number,
  searchQuery: string = '',
  categories?: string[]
): Promise<any> => {
  try {
    const params: any = { boardType, keyword: searchQuery };

    if (categories && categories.length > 0) {
      params.categories = categories.join(',');
    }

    console.log('Fetching posts with params:', params);
    const response = await axiosInstance.get(`/board/list/${page}`, { params });
    console.log('Fetched posts:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      boardItems: [],
      totalPages: 0,
      pageSize: 0,
      totalCnt: 0,
    };
  }
};

// 이미지 업로드
export const uploadImages = async (formData: FormData): Promise<string[]> => {
  try {
    console.log('Uploading images with formData:', formData);
    const response = await axiosInstance.post('/s3/ck/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Uploaded images:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading images:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

// 게시글 추가 (이미지 없이)
export const addPost = async (postData: { boardTitle: string; boardContent: string; boardType: string; boardCategory: string; imageUrls?: string[] }): Promise<any> => {
  try {
    console.log('Adding post with data:', postData);
    const response = await axiosInstance.post('/board/save', postData);
    console.log('Added post:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding post:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

// 게시글 수정
export const updatePost = async (formData: FormData): Promise<any> => {
  try {
    console.log('Updating post with formData:', formData);
    const response = await axiosInstance.post('/board/update', formData);
    console.log('Updated post:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// 게시글 삭제
export const deletePost = async (boardId: string): Promise<any> => {
  try {
    console.log('Deleting post with ID:', boardId);
    await axiosInstance.post(`/board/delete/${boardId}`);
    console.log('Deleted post successfully');
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// 게시글 상세 조회
export const fetchPostDetail = async (boardId: string): Promise<any> => {
  try {
    console.log('Fetching post detail with ID:', boardId);
    const response = await axiosInstance.get(`/board/detail/${boardId}`);
    console.log('Fetched post detail:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching post detail:', error);
    throw error;
  }
};

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

// 좋아요 토글
export const toggleLike = async (boardId: number): Promise<any> => {
  try {
    console.log('Toggling like for board ID:', boardId);
    await axiosInstance.post(`/board/toggle/like/${boardId}`);
    console.log('Toggled like successfully');
  } catch (error) {
    console.error('좋아요 토글 중 오류가 발생했습니다:', error);
    throw error;
  }
};
