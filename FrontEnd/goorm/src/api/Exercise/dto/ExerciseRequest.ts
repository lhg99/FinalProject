import { ExerciseRecords, Memo } from "../../../pages/Exercise/ExerciseTypes";

export interface PostCustomExerciseRequest {
    name: string;
    category: { 
        categoryId: number; 
        categoryName: string 
    };
}

export interface PostCardioRecordRequest {
    trainingId: number;
    caloriesBurned?: number;
    durationMinutes: number;
    intensity: string;
    distance?: number;
    incline?: number;
    satisfaction: number;
}

export interface PostStrengthRecordRequest {
    trainingId: number;
    durationMinutes: number;
    sets?: number;
    weight?: number;
    reps?: number;
    intensity: string;
    satisfaction: number;
}

export interface EditExerciseRecordRequest {
    exerciseRecords: ExerciseRecords[];
    memos: Memo;
}