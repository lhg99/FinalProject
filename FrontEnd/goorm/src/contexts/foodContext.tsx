import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category, ExerciseData, ExerciseRecords } from '../pages/Exercise/ExerciseTypes';

interface FoodState {
    
}

const initialState: FoodState = {

};

interface FoodContextProps {
    state: FoodState;

}

const FoodContext = createContext<FoodContextProps | undefined>(undefined);

export const FoodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<FoodState>(initialState);



    return (
        <FoodContext.Provider value={{
            state
    
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