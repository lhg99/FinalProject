import axiosInstance from '../../../../../api/axiosInstance';
import { BoardDetails } from '../../../types';

export const fetchExercisePosts = async (
  boardType: string = 'WORKOUT',
  page: number,
  searchQuery: string = '',
  categories?: string[]
): Promise<{ boardItems: BoardDetails[], totalPages: number }> => {
  try {
    const params: any = { boardType, keyword: searchQuery };

    if (categories && categories.length > 0) {
      params.categories = categories.join(',');
    }

    const response = await axiosInstance.get(`/board/list/${page}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching exercise posts:', error);
    return { boardItems: [], totalPages: 0 };
  }
};
