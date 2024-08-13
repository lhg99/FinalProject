import axiosInstance from '../../../api/axiosInstance';
import { BoardType} from '../types';

// 게시글 목록 조회
export const fetchPosts = async (
  boardType: BoardType,
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

    return {
      boardItems: response.data.boardItems || [], // 기본값으로 빈 배열 설정
      totalPages: response.data.totalPages || 1, // 기본값으로 1페이지 설정
      pageSize: response.data.pageSize || 0, // 기본값으로 0 설정
      totalCnt: response.data.totalCnt || 0, // 기본값으로 0 설정
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      boardItems: [],
      totalPages: 1,
      pageSize: 0,
      totalCnt: 0,
    };
  }
};


// 게시글 추가 (이미지 없이)
export const addPost = async (postData: { boardTitle: string; boardContent: string; boardType: string; boardCategory: string; imageUrls?: string[]; trainingRecords?: (number | string)[] }): Promise<any> => {
  try {
    console.log('Adding post with data:', postData);
    const response = await axiosInstance.post('/board/save', postData);
    console.log('Added post:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding post:', error);
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
