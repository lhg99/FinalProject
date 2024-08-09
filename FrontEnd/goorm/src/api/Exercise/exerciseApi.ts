import { ExerciseData, ExerciseRecords, Memo } from '../../pages/Exercise/ExerciseTypes';
import { formatDate, formatDateData } from '../../utils/DateUtils';
import axiosInstance from '../axiosInstance';
import { RecordResponse } from './dto/RecordResponse';

export const getExerciseData = async (): Promise<ExerciseData[]> => {
    try {
        const response = await axiosInstance.get<ExerciseData[]>('/admin/trainings');
        console.log("운동 정보", response.data);
        return response.data;
    } catch (err) {
        console.error("failed to get exercise Data: ", err);
        throw err;
    }
};

export const getExerciseRecords = async (): Promise<RecordResponse> => {
    try {
        const response = await axiosInstance.get<RecordResponse>('/record/all');
        console.log("운동기록 가져오기 성공: ", response.data);
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
        console.log("운동 퍼센트 가져오기 성공", response.data);
        return response.data;
    } catch (err) {
        console.error("운동 퍼센트 가져오기 실패", err);
        throw err;
    }
}

export const postCustomExerciseData = async (exercise: { name: string; category: {categoryId: number; categoryName: string} }): Promise<number> => {
    try {
        // console.log("trainingName: ", exercise.trainingName);
        const response = await axiosInstance.post<{id: number}>(`/user/custom-trainings`, exercise);
        console.log("post custom exercise success", response.data);
        return response.data.id;
    } catch(err) {
        console.error("failed to post custom exercise ", err);
        throw err;
    }
}

export const postCardioRecord = async (trainingId: number, exerciseRecord: ExerciseRecords): Promise<void> => {
    const formData = new FormData();
    formData.append('caloriesBurned', exerciseRecord.caloriesBurned?.toString() || '');
    formData.append('durationMinutes', exerciseRecord.durationMinutes.toString());
    formData.append('intensity', exerciseRecord.intensity);
    formData.append('distance', exerciseRecord.distance?.toString() || '');
    formData.append('incline', exerciseRecord.incline?.toString() || '');
    // formData.append('memo', exerciseRecord.memo || '');
    formData.append('satisfaction', exerciseRecord.satisfaction.toString());
    // formData.append('exerciseDate', exerciseRecord.exerciseDate);

    try {
        const response = await axiosInstance.post(`/record/training/${trainingId}/add/cardio`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log("유산소 운동 기록 post 성공", response.data);
    } catch(err) {
        console.error("유산소 운동 기록 post 실패", err);
        throw err;
    }
}

export const postStrengthRecord = async (trainingId: number, exerciseRecord: ExerciseRecords): Promise<void> => {
    const formData = new FormData();
    // formData.append('caloriesBurned', exerciseRecord.caloriesBurned?.toString() || '');
    formData.append('durationMinutes', exerciseRecord.durationMinutes?.toString());
    formData.append('sets', exerciseRecord.sets?.toString() || '');
    formData.append('weight', exerciseRecord.weight?.toString() || '');
    formData.append('reps', exerciseRecord.reps?.toString() || '');
    formData.append('intensity', exerciseRecord.intensity);
    // formData.append('memo', exerciseRecord.memo || '');
    formData.append('satisfaction', exerciseRecord.satisfaction.toString());
    // formData.append('exerciseDate', exerciseRecord.exerciseDate);

    try {
        const response = await axiosInstance.post(`/record/training/${trainingId}/add/strength`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log("근력운동 기록 post 성공", response.data);
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
        console.log("운동 메모 post 성공!!");
    } catch (error) {
        console.error("운동 메모 post 실패", error);
    }
}

export const EditExerciseRecord = async (exerciseRecords: ExerciseRecords[], memos: Memo): Promise<void> => {
    // requestData를 배열로 준비합니다.
    const requestData = exerciseRecords.map(exerciseRecord => ({
      recordId: exerciseRecord.recordId,
      sets: exerciseRecord.sets,
      weight: exerciseRecord.weight,
      reps: exerciseRecord.reps,
      durationMinutes: exerciseRecord.durationMinutes,
      caloriesBurned: exerciseRecord.caloriesBurned,
      incline: exerciseRecord.incline,
      memo: memos.content,
      satisfaction: exerciseRecord.satisfaction,
      intensity: exerciseRecord.intensity,
      distance: exerciseRecord.distance,
    }));
  
    try {
      const response = await axiosInstance.put(`record/edit-multiple`, requestData);
      console.log("운동 기록 수정 성공", response.data);
    } catch (err) {
      console.error("운동 기록 수정 오류", err);
    }
  };

export const deleteRecord = async(recordId: number) => {
    try {
        const response = await axiosInstance.delete(`/record/training/${recordId}/delete`);
        console.log("운동 기록 삭제 성공", response.data);
    } catch(err) {
        console.error("운동 기록 삭제 실패: ", err);
    }
}