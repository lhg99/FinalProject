import axiosInstance from '../../../api/axiosInstance';
import { FoodData, FoodRecord } from '../FoodTypes';

export const getFoodData = async (): Promise<FoodData[]> => {
    try {
        const response = await axiosInstance.get<FoodData[]>('/food/all');
        console.log("음식 정보", response.data);
        return response.data;
    } catch (err) {
        console.error("음식 정보 가져오기 실패", err);
        throw err;
    }
};

export const getFoodRecord = async (): Promise<FoodRecord[]> => {
    try {
        const response = await axiosInstance.get<FoodRecord[]>('/diet/all');
        console.log("식단기록 가져오기 성공: ", response.data);
        return response.data;
    } catch(err) {
        console.error("식단기록 가져오기 실패", err);
        throw err;
    }
}

export const postSearhFood = async (searchQuery: string) => {
    try {
        const response = await axiosInstance.post("/saveApi", searchQuery);
        console.log("음식 검색 요청 성공", response.data);
    } catch (error) {
        console.error("음식 검색 요청 실패", error);        
    }
}

// const formatDate = (date: Date) => {
//     // 'yyyy-MM-dd' 형식으로 날짜를 포맷
//     return date.toISOString().split('T')[0];
// }

// export const getExercisePercentage = async (startDate: Date, endDate: Date) => {
//     const params = {
//         startDate: formatDate(startDate),
//         endDate: formatDate(endDate)
//     };
//     try {
//         const response = await axiosInstance.get('/bodyPartCount/range', { params });
//         console.log("운동 퍼센트 가져오기 성공", response.data);
//         return response.data;
//     } catch (err) {
//         console.error("운동 퍼센트 가져오기 실패", err);
//         throw err;
//     }
// }

// export const postCustomExerciseData = async (exercise: { name: string; category: {categoryId: number; categoryName: string} }): Promise<number> => {
//     try {
//         // console.log("trainingName: ", exercise.trainingName);
//         const response = await axiosInstance.post<{id: number}>(`/user/custom-trainings`, exercise);
//         console.log("post custom exercise success", response.data);
//         return response.data.id;
//     } catch(err) {
//         console.error("failed to post custom exercise ", err);
//         throw err;
//     }
// }

// export const postCardioRecord = async (trainingId: number, exerciseRecord: null, image: File | null): Promise<void> => {
//     const formData = new FormData();
//     formData.append('caloriesBurned', exerciseRecord.caloriesBurned?.toString() || '');
//     formData.append('durationMinutes', exerciseRecord.durationMinutes.toString());
//     formData.append('intensity', exerciseRecord.intensity);
//     formData.append('distance', exerciseRecord.distance?.toString() || '');
//     formData.append('incline', exerciseRecord.incline?.toString() || '');
//     formData.append('memo', exerciseRecord.memo || '');
//     formData.append('satisfaction', exerciseRecord.satisfaction.toString());
//     // formData.append('exerciseDate', exerciseRecord.exerciseDate);

//     if (image) {
//         formData.append('image', image);
//     }
//     try {
//         const response = await axiosInstance.post(`/record/training/${trainingId}/add/cardio`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         });
//         console.log("유산소 운동 기록 post 성공", response.data);
//     } catch(err) {
//         console.error("유산소 운동 기록 post 실패", err);
//         throw err;
//     }
// }

// export const postStrengthRecord = async (trainingId: number, exerciseRecord: , image: File | null): Promise<void> => {
//     const formData = new FormData();
//     // formData.append('caloriesBurned', exerciseRecord.caloriesBurned?.toString() || '');
//     formData.append('durationMinutes', exerciseRecord.durationMinutes?.toString());
//     formData.append('sets', exerciseRecord.sets?.toString() || '');
//     formData.append('weight', exerciseRecord.weight?.toString() || '');
//     formData.append('reps', exerciseRecord.reps?.toString() || '');
//     formData.append('intensity', exerciseRecord.intensity);
//     formData.append('memo', exerciseRecord.memo || '');
//     formData.append('satisfaction', exerciseRecord.satisfaction.toString());
//     // formData.append('exerciseDate', exerciseRecord.exerciseDate);

//     if (image) {
//         formData.append('image', image);
//     }
//     try {
//         const response = await axiosInstance.post(`record/training/${trainingId}/add/strength`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         });
//         console.log("근력운동 기록 post 성공", response.data);
//     } catch(err) {
//         console.error("근력운동 기록 post 실패", err);
//         throw err;
//     }
// }

// export const deleteRecord = async(recordId: number) => {
//     try {
//         const response = await axiosInstance.delete(`/record/training/${recordId}/delete`);
//         console.log("운동 기록 삭제 성공", response.data);
//     } catch(err) {
//         console.error("운동 기록 삭제 실패: ", err);
//     }
// }