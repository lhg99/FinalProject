import { create } from "zustand";
import { Category, ExerciseData, ExerciseRecords } from "../pages/Exercise/api/exerciseApi";

interface ExerciseState {
    exercises: ExerciseData[];
    exerciseDetails: {[key: string]: ExerciseRecords};
    customExercises: ExerciseData[];
    selectedExercises: ExerciseData[];
    categories: Category[];
    exerciseRecords: ExerciseRecords[];
    imageFile: File | null;
    addExercise: (exercise: ExerciseData) => void;
    addCustomExercises: (exercise: ExerciseData) => void;
    addSelectedExercises: (exercise: ExerciseData) => void;
    addExerciseRecord: (record: ExerciseRecords) => void;
    setExercises: (exercises: ExerciseData[]) => void;
    setCategories: (categories: Category[]) => void;
    setImageFile: (file: File | null) => void;
    setExerciseRecords: (records: ExerciseRecords[]) => void;
    removeExercise: (exerciseName: string) => void;
    updateExerciseDetails: (details: ExerciseRecords) => void;
}

export const ExerciseStore = create<ExerciseState>((set, get) => ({
    exercises: [],
    exerciseDetails: {},
    customExercises: [],
    selectedExercises: [],
    categories: [],
    exerciseRecords: [],
    imageFile: null,
    addExercise: (exercise) => set((state) => ({
        exercises: [...state.exercises, exercise]
    })),
    addCustomExercises: (exercise) => set((state) => ({
        customExercises: [...state.customExercises, exercise]
    })),
    addSelectedExercises: (exercise) => set((state) => {
        console.log("Adding selected exercise:", exercise);
        return {
            selectedExercises: state.selectedExercises.some(ex => ex.name === exercise.name)
                ? state.selectedExercises
                : [...state.selectedExercises, exercise]
        };
    }),
    addExerciseRecord: (record) => set((state) => ({
        exerciseRecords: [...state.exerciseRecords, record]
    })),
    setExercises: (exercises) => set({ exercises }),
    setCategories: (categories) => set({ categories }),
    setExerciseRecords: (records) => set({ exerciseRecords: records }),
    setImageFile: (file) => set({imageFile: file}),
    removeExercise: (exerciseName) => set((state) => ({
        selectedExercises: state.selectedExercises.filter((ex) => ex.name !== exerciseName)
    })),
    updateExerciseDetails: (details) => {
        const state = get();
        if (JSON.stringify(state.exerciseDetails[details.trainingName]) !== JSON.stringify(details)) {
            set((state) => ({
                exerciseDetails: {
                    ...state.exerciseDetails,
                    [details.trainingName]: details
                }
            }));
        }
    }
}));