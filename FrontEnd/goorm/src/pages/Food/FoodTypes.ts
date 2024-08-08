export interface FoodData {
    foodId: number;
    foodName: string;
    amount: number;
    calories: number;
    carbohydrate: number;
    protein: number;
    fat: number;
    mealType?: string;
}

export interface FoodCategory {
    categoryName: string;
}

export interface FoodRecord {
    dietId: number;
    mealType: string;
    quantity: number;
    dietMemo?: string;
    dietDate: string;
    gram: number;
    foodRes: {
        foodId: number,
        foodName: string,
        calories: number,
        fat: number,
        protein: number,
        carbohydrate: number
    };
    totalCalories: number;
    memo?: string;
}