export interface FoodData {
    foodId: number;
    foodName: string;
    amount: number;
    calories: number;
    carbohydrate: number;
    protein: number;
    fat: number;
    mealTime?: string;
    sugar: number;
    salt: number;
    cholesterol: number;
    saturatedFat: number;
    transFat: number;
}

export interface FoodCategory {
    categoryName: string;
}

export interface DietMemo {
    content: string;
    date: string;
}

export interface FoodRecord {
    dietId: number;
    mealTime: string;
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
        carbohydrate: number,
        sugar: number,
        salt: number,
        cholesterol: number,
        saturatedFat: number,
        transFat: number
    };
    totalCalories: number;
    totalGram?: number;
    memo?: string;
}