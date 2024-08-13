import { ExerciseData, ExerciseRecords, Memo } from '../../pages/Exercise/ExerciseTypes';
import { formatDate } from '../../utils/DateUtils';
import axiosInstance from '../axiosInstance';
import { EditExerciseRecordRequest, PostCardioRecordRequest, PostCustomExerciseRequest, PostStrengthRecordRequest } from './dto/ExerciseRequest';

export const getExerciseData = async (): Promise<ExerciseData[]> => {
    try {
        const response = await axiosInstance.get<ExerciseData[]>('/admin/trainings');
        return response.data;
    } catch (err) {
        console.error("failed to get exercise Data: ", err);
        throw err;
    }
};

export const getExerciseRecords = async (): Promise<ExerciseRecords[]> => {
    try {
        const response = await axiosInstance.get<ExerciseRecords[]>('/record/all');
        return response.data;
    } catch(err) {
        console.error("failed to get exercise records: ", err);
        throw err;
    }
}

export const getExercisePercentage = async (startDate: Date, endDate: Date) => {
    const params = {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate)
    };
    try {
        const response = await axiosInstance.get('/bodyPartCount/range', { params });
        return response.data;
    } catch (err) {
        console.error("운동 퍼센트 가져오기 실패", err);
        throw err;
    }
}

export const postCustomExerciseData = async (request: PostCustomExerciseRequest): Promise<number> => {
    try {
        const response = await axiosInstance.post<{id: number}>(`/user/custom-trainings`, request);
        return response.data.id;
    } catch(err) {
        console.error("failed to post custom exercise ", err);
        throw err;
    }
}

export const postCardioRecord = async (request: PostCardioRecordRequest): Promise<void> => {
    const formData = new FormData();
    formData.append('caloriesBurned', request.caloriesBurned?.toString() || '');
    formData.append('durationMinutes', request.durationMinutes.toString());
    formData.append('intensity', request.intensity);
    formData.append('distance', request.distance?.toString() || '');
    formData.append('satisfaction', request.satisfaction.toString());

    try {
        const response = await axiosInstance.post(`/record/training/${request.trainingId}/add/cardio`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch(err) {
        console.error("유산소 운동 기록 post 실패", err);
        throw err;
    }
}

export const postStrengthRecord = async (request: PostStrengthRecordRequest): Promise<void> => {
    const formData = new FormData();
    formData.append('durationMinutes', request.durationMinutes?.toString());
    formData.append('sets', request.sets?.toString() || '');
    formData.append('weight', request.weight?.toString() || '');
    formData.append('reps', request.reps?.toString() || '');
    formData.append('intensity', request.intensity);
    formData.append('satisfaction', request.satisfaction.toString());

    try {
        const response = await axiosInstance.post(`/record/training/${request.trainingId}/add/strength`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch(err) {
        console.error("근력운동 기록 post 실패", err);
        throw err;
    }
}

export const postExerciseMemo = async(memo: string) => {
    const request = {
        "content" : memo
    }
    try {
        const response = await axiosInstance.post(`/memo`, request);
        return response.data;
    } catch (error) {
        console.error("운동 메모 post 실패", error);
    }
}

export const EditExerciseRecord = async (request: EditExerciseRecordRequest): Promise<void> => {
    // requestData를 배열로 준비합니다.
    const requestData = request.exerciseRecords.map(exerciseRecord => ({
      recordId: exerciseRecord.recordId,
      sets: exerciseRecord.sets,
      weight: exerciseRecord.weight,
      reps: exerciseRecord.reps,
      durationMinutes: exerciseRecord.durationMinutes,
      caloriesBurned: exerciseRecord.caloriesBurned,
      memo: request.memos.content,
      satisfaction: exerciseRecord.satisfaction,
      intensity: exerciseRecord.intensity,
      distance: exerciseRecord.distance,
    }));
  
    try {
      const response = await axiosInstance.put(`record/edit-multiple`, requestData);
      return response.data;
    } catch (err) {
      console.error("운동 기록 수정 오류", err);
    }
  };

export const deleteRecord = async(recordId: number) => {
    try {
        const response = await axiosInstance.delete(`/record/training/${recordId}/delete`);
        return response.data;
    } catch(err) {
        console.error("운동 기록 삭제 실패: ", err);
    }
}