import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category, ExerciseData, ExerciseRecords, Memo } from '../pages/Exercise/ExerciseTypes';

interface ExerciseState {
    exercises: ExerciseData[];
    exerciseDetails: { [key: string]: ExerciseRecords };
    customExercises: ExerciseData[];
    selectedExercises: ExerciseData[];
    categories: Category[];
    exerciseRecords: ExerciseRecords[];
    selectedExerciseRecords: ExerciseRecords[];
    imageFile: File | null;
    isAddingExercise: boolean;
    startDate: Date;
    endDate: Date;
    memo: Memo;
    isDeleteModalOpen: boolean;
    isEditModalOpen: boolean;
    selectedRecords: number;
}

const initialState: ExerciseState = {
    exercises: [],
    exerciseDetails: {},
    customExercises: [],
    selectedExercises: [],
    selectedExerciseRecords: [],
    categories: [],
    exerciseRecords: [],
    imageFile: null,
    isAddingExercise: false,
    startDate: new Date(),
    endDate: new Date(),
    memo: { content: '', date: '' },
    isDeleteModalOpen: false,
    isEditModalOpen: false,
    selectedRecords: 0,
};

interface ExerciseContextProps {
    state: ExerciseState;
    addExercise: (exercise: ExerciseData) => void;
    addCustomExercises: (exercise: ExerciseData) => void;
    addSelectedExercises: (exercise: ExerciseData) => void;
    addExerciseRecord: (record: ExerciseRecords) => void;
    setExercises: (exercises: ExerciseData[]) => void;
    setCategories: (categories: Category[]) => void;
    setImageFile: (file: File | null) => void;
    setExerciseRecords: (records: ExerciseRecords[]) => void;
    setIsAddingExercise: (adding: boolean) => void;
    setStartDate: (date: Date) => void;
    setEndDate: (date: Date) => void;
    setMemo: (memo: Memo) => void;
    setSelectedExerciseRecords: (records: ExerciseRecords[]) => void; // 추가된 함수
    removeExercise: (exerciseName: string) => void;
    updateExerciseDetails: (details: ExerciseRecords) => void;
    updateExerciseRecords: (recordId: number, updatedDetails: Partial<ExerciseRecords>) => void; // 추가
    updateExerciseMemo: (recordId: number, memo: string) => void;
    setSelectedRecord: (recordId: number) => void; // 선택된 레코드를 설정하는 함수
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
            exerciseRecords: [...prevState.exerciseRecords, record] // record를 배열에 직접 추가
        }));
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
        setState(prevState => ({
            ...prevState,
            exerciseRecords: records
        }));
    };

    const setIsAddingExercise = (adding: boolean) => {
        setState(prevState => ({ ...prevState, isAddingExercise: adding })); // 변경된 부분
    };

    const setStartDate = (date: Date) => {
        setState(prevState => ({...prevState, startDate: date}));
    }

    const setEndDate = (date: Date) => {
        setState(prevState => ({...prevState, endDate: date}));
    }

    const setMemo = (memo: Memo) => {
        setState(prevState => ({...prevState, memo }));
    };

    const setSelectedExerciseRecords = (records: ExerciseRecords[]) => {
        setState(prevState => ({
            ...prevState,
            selectedExerciseRecords: records
        }));
    };

    const removeExercise = (exerciseName: string) => {
        setState(prevState => ({
            ...prevState,
            selectedExercises: prevState.selectedExercises.filter(ex => ex.name !== exerciseName),
            exerciseRecords: prevState.exerciseRecords.filter(rec => rec.trainingName !== exerciseName) // content 제거
        }));
    };

    const updateExerciseDetails = (updatedRecord: ExerciseRecords) => {
        setState(prevState => ({
          ...prevState,
          exerciseDetails: {
            ...prevState.exerciseDetails,
            [updatedRecord.trainingName]: updatedRecord // Update the specific record
          }
        }));
      };

    const updateExerciseRecords = (recordId: number, updatedDetails: Partial<ExerciseRecords>) => {
        setState((prevState) => {
            const updatedRecords = prevState.exerciseRecords.map(record =>
                record.recordId === recordId ? { ...record, ...updatedDetails } : record
            );

            return {
                ...prevState,
                exerciseRecords: updatedRecords,
            };
        });
    };

    const updateExerciseMemo = (recordId: number, memo: string) => {
        setState((prevState) => {
          const updatedRecords = prevState.exerciseRecords.map((record) => {
            if (record.recordId === recordId) {
              return { ...record, memo };
            }
            return record;
          });
    
          return {
            ...prevState,
            exerciseRecords: updatedRecords,
          };
        });
      };

   // 선택된 레코드 ID 설정
    const setSelectedRecord = (recordId: number) => {
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
            setExercises,
            setCategories,
            setImageFile,
            setExerciseRecords,
            setIsAddingExercise,
            setStartDate,
            setEndDate,
            setMemo,
            removeExercise,
            updateExerciseDetails,
            updateExerciseRecords,
            updateExerciseMemo,
            setSelectedRecord,
            setSelectedExerciseRecords
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
