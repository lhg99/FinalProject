import { create } from "zustand";
import { Category, ExerciseData, ExerciseDetails } from "../api/ExerciseApi";

interface ExerciseState {
    exercises: ExerciseData[];
    exerciseDetails: ExerciseDetails[];
    customExercises: ExerciseData[];
    selectedExercises: ExerciseData[];
    categories: Category[];
    setExercises: (exercises: ExerciseData[]) => void;
    setCategories: (categories: Category[]) => void;
    addExercise: (exercise: ExerciseData) => void;
    addCustomExercises: (exercise: ExerciseData) => void;
    addSelectedExercises: (exercise: ExerciseData) => void;
    removeExercise: (exerciseName: string) => void;
    updateExerciseDetails: (details: ExerciseDetails) => void;
}

export const ExerciseStore = create<ExerciseState>((set) => ({
    exercises: [],
    exerciseDetails: [],
    customExercises: [],
    selectedExercises: [],
    categories: [],
    setExercises: (exercises) => set({ exercises }),
    setCategories: (categories) => set({ categories }),
    addExercise: (exercise) => set((state) => ({
        exercises: [...state.exercises, exercise]
    })),
    addCustomExercises: (exercise) => set((state) => ({
        customExercises: [...state.customExercises, exercise]
    })),
    addSelectedExercises: (exercise) => set((state) => ({
        selectedExercises: [...state.selectedExercises, exercise]
    })),
    removeExercise: (exerciseName) => set((state) => ({
        selectedExercises: state.selectedExercises.filter((ex) => ex.training_name !== exerciseName)
    })),
    updateExerciseDetails: (details) => set((state) => ({
        exerciseDetails: {
            ...state.exerciseDetails,
            [details.training_name]: details
        }
    }))
}));