import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category, ExerciseData, ExerciseRecords } from '../pages/Exercise/ExerciseTypes';

interface ExerciseState {
    exercises: ExerciseData[];
    exerciseDetails: { [key: string]: ExerciseRecords };
    customExercises: ExerciseData[];
    selectedExercises: ExerciseData[];
    categories: Category[];
    exerciseRecords: ExerciseRecords[];
    imageFile: File | null;
    isAddingExercise: boolean;
    startDate: Date;
    endDate: Date;
    memo: string;
    isDeleteModalOpen: boolean;
    isEditModalOpen: boolean;
    selectedRecords: number | null;
}

const initialState: ExerciseState = {
    exercises: [],
    exerciseDetails: {},
    customExercises: [],
    selectedExercises: [],
    categories: [],
    exerciseRecords: [],
    imageFile: null,
    isAddingExercise: false,
    startDate: new Date(),
    endDate: new Date(),
    memo: "",
    isDeleteModalOpen: false,
    isEditModalOpen: false,
    selectedRecords: null,
};

interface ExerciseContextProps {
    state: ExerciseState;
    addExercise: (exercise: ExerciseData) => void;
    addCustomExercises: (exercise: ExerciseData) => void;
    addSelectedExercises: (exercise: ExerciseData) => void;
    addExerciseRecord: (record: ExerciseRecords) => void;
    addMemo: (recordId: number, memo: string) => void;
    setExercises: (exercises: ExerciseData[]) => void;
    setCategories: (categories: Category[]) => void;
    setImageFile: (file: File | null) => void;
    setExerciseRecords: (records: ExerciseRecords[]) => void;
    setIsAddingExercise: (adding: boolean) => void;
    setStartDate: (date: Date) => void;
    setEndDate: (date: Date) => void;
    setIsDeleteModalOpen: (isOpen: boolean) => void;
    setIsEditModalOpen: (isOpen: boolean) => void;
    removeExercise: (exerciseName: string) => void;
    updateExerciseDetails: (details: ExerciseRecords) => void;
    setSelectedRecord: (recordId: number | null) => void; // 선택된 레코드를 설정하는 함수
}

const ExerciseContext = createContext<ExerciseContextProps | undefined>(undefined);

export const ExerciseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<ExerciseState>(initialState);

    const addExercise = (exercise: ExerciseData) => {
        setState(prevState => ({
            ...prevState,
            exercises: [...prevState.exercises, exercise]
        }));
    };

    const addCustomExercises = (exercise: ExerciseData) => {
        setState(prevState => ({
            ...prevState,
            customExercises: [...prevState.customExercises, exercise],
            exercises: [...prevState.exercises, exercise]
        }));
    };

    const addSelectedExercises = (exercise: ExerciseData) => {
        console.log('Adding Selected Exercise:', exercise); // 디버깅을 위한 로그 추가
        setState(prevState => {
            if (!prevState.selectedExercises.some(selected => selected.name.toLowerCase() === exercise.name.toLowerCase())) {
                return { ...prevState, selectedExercises: [...prevState.selectedExercises, exercise] };
            }
            return prevState;
        });
    };

    const addExerciseRecord = (record: ExerciseRecords) => {
        setState(prevState => ({
            ...prevState,
            exerciseRecords: [...prevState.exerciseRecords, record]
        }));
    };

    const addMemo = (recordId: number, memo: string) => {
        console.log("메모 추가", memo);
        setState(prevState => {
            // Find the exercise record to update
            const updatedExerciseDetails = { ...prevState.exerciseDetails };
            const recordKey = Object.keys(updatedExerciseDetails).find(
                key => updatedExerciseDetails[key].recordId === recordId
            );

            if (recordKey) {
                updatedExerciseDetails[recordKey] = {
                    ...updatedExerciseDetails[recordKey],
                    memo
                };
            }

            return {
                ...prevState,
                exerciseDetails: updatedExerciseDetails
            };
        });
    };

    const setExercises = (exercises: ExerciseData[]) => {
        setState(prevState => ({ ...prevState, exercises }));
    };

    const setCategories = (categories: Category[]) => {
        setState(prevState => ({ ...prevState, categories }));
    };

    const setImageFile = (file: File | null) => {
        setState(prevState => ({ ...prevState, imageFile: file }));
    };

    const setExerciseRecords = (records: ExerciseRecords[]) => {
        setState(prevState => ({ ...prevState, exerciseRecords: records }));
    };

    const setIsAddingExercise = (adding: boolean) => {
        setState(prevState => ({ ...prevState, addingNewExercise: adding }));
    };

    const setStartDate = (date: Date) => {
        setState(prevState => ({...prevState, startDate: date}));
    }

    const setEndDate = (date: Date) => {
        setState(prevState => ({...prevState, endDate: date}));
    }

    const setIsDeleteModalOpen = (isOpen: boolean) => {
        setState(prevState => ({...prevState, isDeleteModalOpen: isOpen }));
    };

    const setIsEditModalOpen = (isOpen: boolean) => {
        setState(prevState => ({...prevState, isEditModalOpen: isOpen }));
    }

    const removeExercise = (exerciseName: string) => {
        setState(prevState => ({
            ...prevState,
            selectedExercises: prevState.selectedExercises.filter(ex => ex.name !== exerciseName),
            exerciseRecords: prevState.exerciseRecords.filter(rec => rec.trainingName !== exerciseName)
        }));
    };

    const updateExerciseDetails = (details: ExerciseRecords) => {
        console.log('Updating Exercise Details:', details); // 디버깅용 로그 추가
        setState(prevState => ({
            ...prevState,
            exerciseDetails: {
                ...prevState.exerciseDetails,
                [details.trainingName]: details
            }
        }));
    };

   // 선택된 레코드 ID 설정
    const setSelectedRecord = (recordId: number | null) => {
        setState(prevState => ({
            ...prevState,
            selectedRecord: recordId
        }));
    };

    

    return (
        <ExerciseContext.Provider value={{
            state,
            addExercise,
            addCustomExercises,
            addSelectedExercises,
            addExerciseRecord,
            addMemo,
            setExercises,
            setCategories,
            setImageFile,
            setExerciseRecords,
            setIsAddingExercise,
            setStartDate,
            setEndDate,
            setIsDeleteModalOpen,
            setIsEditModalOpen,
            removeExercise,
            updateExerciseDetails,
            setSelectedRecord
        }}>
            {children}
        </ExerciseContext.Provider>
    );
};

export const useExercise = () => {
    const context = useContext(ExerciseContext);
    if (context === undefined) {
        throw new Error('useExercise must be used within an ExerciseProvider');
    }
    return context;
};
