export interface ExerciseData {
    id: number;
    name: string;
    categoryId: number;
    categoryName: string;
    isAddingExercise?: boolean;
}

export interface Category {
    categoryId: number;
    categoryName: string;
}

export interface ExerciseRecords {
    recordId: number;
    trainingName: string;
    exerciseDate: string; // Date 문자열로 나타내기 때문에 string 타입으로 변경
    sets?: number | null;
    weight?: number | null;
    distance?: number | null;
    durationMinutes: number;
    caloriesBurned?: number | null;
    incline?: number | null;
    reps?: number | null;
    satisfaction: number;
    intensity: string; // 운동 강도(high, middle, low)
    memo?: string;
    imageUrl?: string;
    categoryName: string;
    trainingId: number;
    isAddingExercise?: boolean;
}