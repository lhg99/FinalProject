export interface ExerciseData {
    id: number;
    name: string;
    categoryName: string;
    categoryId: number;
    isAddingExercise?: boolean;
}

export interface Category {
    categoryId: number;
    categoryName: string;
}

export interface ExerciseCount {
    [categoryName: string]: {
        count: number;
        percentage: number;
    };
}

export interface ExerciseRecords {
    recordId: number;
    trainingName: string;
    exerciseDate: string; // Date 문자열로 나타내기 때문에 string 타입으로 변경
    sets?: number;
    weight?: number;
    distance?: number;
    durationMinutes: number;
    caloriesBurned?: number;
    incline?: number;
    reps?: number;
    satisfaction: number;
    intensity: string; // 운동 강도(high, middle, low)
    memo?: string;
    imageUrl?: string;
    categoryName: string;
    trainingId: number;
    isAddingExercise?: boolean;
}