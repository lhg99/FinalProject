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

export interface Memo {
    content: string;
    date: string;
}

export interface ExerciseRecords {
    recordId: number;
    trainingName: string;
    exerciseDate: string;
    sets?: number;
    weight?: number;
    distance?: number;
    durationMinutes: number;
    caloriesBurned?: number;
    reps?: number;
    memo?: string;
    satisfaction: number;
    intensity: string;
    categoryName: string;
    trainingId: number;
    isAddingExercise?: boolean;
    totalCaloriesBurned?: number;
}

export interface TotalExerciseData {
    totalDurationMinutes: number;
    totalCaloriesBurned: number;
}