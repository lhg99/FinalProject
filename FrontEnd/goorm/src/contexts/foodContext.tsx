import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FoodData, FoodCategory, FoodRecord, DietMemo } from '../pages/Food/FoodTypes';

interface FoodState {
    food: FoodData[]; // 모든 음식을 저장
    customFood: FoodData[]; // 사용자가 자유 입력으로 추가할 음식
    selectedFood: FoodData[]; // FoodSearch에서 클릭한 음식
    foodCategories: FoodCategory[]; // 아침, 점심, 저녁, 간식 카테고리
    foodRecords: FoodRecord[]; // 모든 식단 기록을 저장
    foodDetails: { [key: string]: FoodRecord };
    selectedFoodRecords: FoodRecord[]; // 식단 기록에서 수정할 부분이 있는 기록들
    mealTime: string; // BREAKFAST, LUNCH, DINNER, SNACK
    memo: DietMemo;
}

const initialState: FoodState = {
    food: [],
    customFood: [],
    selectedFood: [],
    foodCategories: [],
    foodRecords: [],
    foodDetails: {},
    selectedFoodRecords: [],
    mealTime: "",
    memo: { content: '', date: '' },

};

interface FoodContextProps {
    state: FoodState;
    setFood: (food: FoodData[]) => void;
    setFoodCategories: (categories: FoodCategory[]) => void;
    setFoodRecord: (foodRecord: FoodRecord[]) => void;
    setSelectedFoodRecords: (foodRecord: FoodRecord[]) => void;
    setMealTime: (mealTime: string) => void;
    setMemo: (memo: DietMemo) => void;
    addFood: (food: FoodData) => void;
    addCustomFood: (food: FoodData, mealTime: string) => void;
    addSelectedFood: (food: FoodData, mealTime: string) => void;
    addSelectedFoodRecords: (records: FoodRecord[]) => void;
    updateFoodDetails: (details: FoodRecord) => void;
    updateFoodRecords: (recordId: number, updatedDetails: Partial<FoodRecord>) => void;
    removeFood: (foodName: string) => void;
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

    const setMealTime = (mealTime: string) => {
        setState(prevState => ({...prevState, mealTime}));
    }

    const setMemo = (memo: DietMemo) => {
        setState(prevState => ({...prevState, memo }));
    };
    

    const addFood = (foodData: FoodData) => {
        setState(prevState => ({
            ...prevState,
            food: [...prevState.food, foodData],
        }));
    }

    const addCustomFood = (food: FoodData, mealTime: string) => {
        setState(prevState => ({
            ...prevState,
            customFood: [...prevState.customFood, food], 
            food: [...prevState.food, { ...food, mealTime}]
        }));
    }

    const addSelectedFood = (food: FoodData, mealTime: string) => {
        setState(prevState => {
            if (!prevState.selectedFood.some(selected => selected.foodName.toLowerCase() === food.foodName.toLowerCase())) {
                return { ...prevState, selectedFood: [...prevState.selectedFood, { ...food, mealTime }] }; // mealTime 포함
            }
            return prevState;
        });
    }

    const addSelectedFoodRecords = (records: FoodRecord[]) => {
        setState(prevState => ({
            ...prevState,
            selectedFoodRecords: [...prevState.selectedFoodRecords, ...records],
        }));
    };

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

    const removeFood = (foodName: string) => {
        setState(prevState => ({
            ...prevState,
            selectedFood: prevState.selectedFood.filter(ex => ex.foodName !== foodName),
            foodRecords: prevState.foodRecords.filter(rec => rec.foodRes.foodName !== foodName)
        }));
    };



    return (
        <FoodContext.Provider value={{
            state,
            setFood,
            setFoodCategories,
            setFoodRecord,
            setSelectedFoodRecords,
            setMealTime,
            setMemo,
            addFood,
            addCustomFood,
            addSelectedFood,
            addSelectedFoodRecords,
            updateFoodDetails,
            updateFoodRecords,
            removeFood
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