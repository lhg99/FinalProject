import { create } from "zustand";
import { Category, ExerciseData, ExerciseDetailInfo } from "../api/exerciseApi";
import { ExerciseRecords } from './../api/exerciseApi';

interface ExerciseState {
    exercises: ExerciseData[];
    exerciseDetails: ExerciseDetailInfo[];
    customExercises: ExerciseData[];
    selectedExercises: ExerciseData[];
    categories: Category[];
    exerciseRecords: ExerciseRecords[];
    addExercise: (exercise: ExerciseData) => void;
    addCustomExercises: (exercise: ExerciseData) => void;
    addSelectedExercises: (exercise: ExerciseData) => void;
    addExerciseRecord: (record: ExerciseRecords) => void;
    setExercises: (exercises: ExerciseData[]) => void;
    setCategories: (categories: Category[]) => void;
    setExerciseRecords: (records: ExerciseRecords[]) => void;
    removeExercise: (exerciseName: string) => void;
    updateExerciseDetails: (details: ExerciseDetailInfo) => void;
}

export const ExerciseStore = create<ExerciseState>((set) => ({
    exercises: [],
    exerciseDetails: [],
    customExercises: [],
    selectedExercises: [],
    categories: [],
    exerciseRecords: [],
    addExercise: (exercise) => set((state) => ({
        exercises: [...state.exercises, exercise]
    })),
    addCustomExercises: (exercise) => set((state) => ({
        customExercises: [...state.customExercises, exercise]
    })),
    addSelectedExercises: (exercise) => set((state) => ({
        selectedExercises: state.selectedExercises.find(ex => ex.training_name === exercise.training_name)
            ? state.selectedExercises
            : [...state.selectedExercises, exercise]
    })),
    addExerciseRecord: (record) => set((state) => ({
        exerciseRecords: [...state.exerciseRecords, record]
    })),
    setExercises: (exercises) => set({ exercises }),
    setCategories: (categories) => set({ categories }),
    setExerciseRecords: (records) => set({ exerciseRecords: records }),
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