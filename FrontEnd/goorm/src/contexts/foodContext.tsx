import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category, ExerciseData, ExerciseRecords } from '../pages/Exercise/ExerciseTypes';
import { FoodData, FoodCategory } from '../pages/Food/FoodTypes';

interface FoodState {
    food: FoodData[];
    customFood: FoodData[];
    selectedFood: FoodData[];
    foodCategories: FoodCategory[];

}

const initialState: FoodState = {
    food: [],
    customFood: [],
    selectedFood: [],
    foodCategories: [],

};

interface FoodContextProps {
    state: FoodState;
    setFood: (food: FoodData[]) => void;
    setFoodCategories: (categories: FoodCategory[]) => void;
    addFood: (food: FoodData) => void;
    addCustomFood: (food: FoodData) => void;
    addSelectedFood: (food: FoodData) => void;
}

const FoodContext = createContext<FoodContextProps | undefined>(undefined);

export const FoodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<FoodState>(initialState);

    const setFood = (food: FoodData[]) => {
        setState(prevState => ({...prevState, food}));
    }

    const setFoodCategories = (categories: FoodCategory[]) => {
        setState(prevState => ({...prevState, categories}));
    }

    const addFood = (food: FoodData) => {
        setState(prevState => ({
            ...prevState,
            food: [...prevState.food, food]}));
    }

    const addCustomFood = (food: FoodData) => {
        setState(prevState => ({
            ...prevState,
            customFood: [...prevState.customFood, food], 
            food: [...prevState.food, food]}));
    }

    const addSelectedFood = (food: FoodData) => {
        setState(prevState => {
            if (!prevState.selectedFood.some(selected => selected.foodName.toLowerCase() === food.foodName.toLowerCase())) {
                return { ...prevState, selectedFood: [...prevState.selectedFood, food] };
            }
            return prevState;
        })
    }



    return (
        <FoodContext.Provider value={{
            state,
            setFood,
            setFoodCategories,
            addFood,
            addCustomFood,
            addSelectedFood
    
        }}>
            {children}
        </FoodContext.Provider>
    );
};

export const useFood = () => {
    const context = useContext(FoodContext);
    if (context === undefined) {
        throw new Error('useExercise must be used within an ExerciseProvider');
    }
    return context;
};