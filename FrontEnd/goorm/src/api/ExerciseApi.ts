/**
 * exercise api 가져오는 부분
 */
import axiosInstance from './axiosInstance';

export interface ExerciseData {
    category_id: number;
    training_name: string;
}

export interface Category {
    category_id: number;
    category_name: string;
}

export interface ExerciseDetails {
    training_name: string;
    duration: string;
    weight?: string;
    count?: string;
    slope?: string;
    pressure?: string;
    sets?: SetDetails[];
}

export interface SetDetails {
    weight: string;
    count: string;
}

export interface ExerciseInfo extends ExerciseData {
    category_name: string;
}


// // 하드코딩된 카테고리 데이터
// const categories: Category[] = [
//     { category_id: 0, category_name: '전체'},
//     { category_id: 1, category_name: '유산소' },
//     { category_id: 2, category_name: '어깨' },
//     { category_id: 3, category_name: '등' }
// ];

// // 하드코딩된 운동 데이터
// const exercises: ExerciseData[] = [
//     { training_name: '러닝', category_id: 1 },
//     { training_name: '자전거 타기', category_id: 1 },
//     { training_name: '숄더 프레스', category_id: 2 },
//     { training_name: '래터럴 레이즈', category_id: 2 },
//     { training_name: '랫 풀다운', category_id: 3 },
//     { training_name: '바벨 로우', category_id: 3 }
// ];

export const getExerciseData = async (): Promise<ExerciseData[]> => {
    try {
        const response = await axiosInstance.get<ExerciseData[]>(`/trainings`);
        return response.data;
    } catch (err) {
        console.error("failed to get exercise Data: ",err);
        throw err;
    }
    // return exercises;
};

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await axiosInstance.get<Category[]>(`/categories`);
        return response.data;
    } catch(err) {
        console.error("failed to get categories: ", err);
        throw err;
    }
    // return categories;
};

export const postCustomExerciseData = async (exercise: ExerciseData): Promise<void> => {
    try {
        const response = await axiosInstance.post<ExerciseData[]>(`/trainings`, exercise);
        console.log("post custom exercise success", response.data);
    } catch(err) {
        console.error("failed to post custom exercise ", err);
        throw err;
    }
}

export const postExerciseRecord = async (): Promise<void> => {
    try {
        const response = await axiosInstance.post('/records');
        console.log("post exercise record success", response.data);
    } catch(err) {
        console.error("failed to post exercise", err);
        throw err;
    }
}