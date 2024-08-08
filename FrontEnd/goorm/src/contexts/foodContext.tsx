import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category, ExerciseData, ExerciseRecords } from '../pages/Exercise/ExerciseTypes';
import { FoodData, FoodCategory, FoodRecord } from '../pages/Food/FoodTypes';

interface FoodState {
    food: FoodData[]; // 모든 음식을 저장
    customFood: FoodData[]; // 사용자가 자유 입력으로 추가할 음식
    selectedFood: FoodData[]; // FoodSearch에서 클릭한 음식
    foodCategories: FoodCategory[]; // 아침, 점심, 저녁, 간식 카테고리
    foodRecords: FoodRecord[]; // 모든 식단 기록을 저장
    foodDetails: FoodRecord[]; // 유저가 추가한 식단 기록
    selectedFoodRecords: FoodRecord[]; // 식단 기록에서 수정할 부분이 있는 기록들
    mealType: string; // BREAKFAST, LUNCH, DINNER, SNACK
}

const initialState: FoodState = {
    food: [],
    customFood: [],
    selectedFood: [],
    foodCategories: [],
    foodRecords: [],
    foodDetails: [],
    selectedFoodRecords: [],
    mealType: "",

};

interface FoodContextProps {
    state: FoodState;
    setFood: (food: FoodData[]) => void;
    setFoodCategories: (categories: FoodCategory[]) => void;
    setFoodRecord: (foodRecord: FoodRecord[]) => void;
    setSelectedFoodRecords: (foodRecord: FoodRecord[]) => void;
    setMealType: (mealType: string) => void;
    addFood: (food: FoodData) => void; // 수정된 부분
    addCustomFood: (food: FoodData, mealType: string) => void;
    addSelectedFood: (food: FoodData, mealType: string) => void; // 수정된 부분
    updateFoodDetails: (details: FoodRecord) => void;
    updateFoodRecords: (recordId: number, updatedDetails: Partial<FoodRecord>) => void; // 추가
}

const FoodContext = createContext<FoodContextProps | undefined>(undefined);

export const FoodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<FoodState>(initialState);

    const setFood = (food: FoodData[]) => {
        setState(prevState => ({...prevState, food}));
    }

    const setFoodCategories = (categories: FoodCategory[]) => {
        setState(prevState => ({ ...prevState, foodCategories: categories }));
    };
    
    const setFoodRecord = (foodRecord: FoodRecord[]) => {
        setState(prevState => ({ ...prevState, foodRecords: foodRecord }));
    };

    const setSelectedFoodRecords = (foodRecord: FoodRecord[]) => {
        setState(prevState => ({...prevState, selectedFoodRecords: foodRecord }));
    }

    const setMealType = (mealType: string) => {
        setState(prevState => ({...prevState, mealType}));
    }
    

    const addFood = (foodData: FoodData) => {
        setState(prevState => ({
            ...prevState,
            food: [...prevState.food, foodData],
        }));
    }

    const addCustomFood = (food: FoodData, mealType: string) => {
        setState(prevState => ({
            ...prevState,
            customFood: [...prevState.customFood, food], 
            food: [...prevState.food, { ...food, mealType}]
        }));
    }

    const addSelectedFood = (food: FoodData, mealType: string) => {
        setState(prevState => {
            if (!prevState.selectedFood.some(selected => selected.foodName.toLowerCase() === food.foodName.toLowerCase())) {
                return { ...prevState, selectedFood: [...prevState.selectedFood, { ...food, mealType }] }; // mealType 포함
            }
            return prevState;
        });
    }

    const updateFoodDetails = (updatedRecord: FoodRecord) => {
        setState(prevState => ({
            ...prevState,
            foodDetails: {
                ...prevState.foodDetails,
                [updatedRecord.foodRes.foodName]: updatedRecord // Update the specific record
            }
            }));
        };

    const updateFoodRecords = (recordId: number, updatedDetails: Partial<FoodRecord>) => {
        setState((prevState) => {
            const updatedRecords = prevState.foodRecords.map(record =>
                record.dietId === recordId ? { ...record, ...updatedDetails } : record
            );
    
            return {
                ...prevState,
                foodRecords: updatedRecords,
            };
        });
    };



    return (
        <FoodContext.Provider value={{
            state,
            setFood,
            setFoodCategories,
            setFoodRecord,
            setSelectedFoodRecords,
            setMealType,
            addFood,
            addCustomFood,
            addSelectedFood,
            updateFoodDetails,
            updateFoodRecords
        }}>
            {children}
        </FoodContext.Provider>
    );
};

export const useFood = () => {
    const context = useContext(FoodContext);
    if (context === undefined) {
        throw new Error('useFood must be used within a FoodProvider');
    }
    return context;
};