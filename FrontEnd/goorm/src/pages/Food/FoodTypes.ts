export interface FoodData {
    foodId: number;
    foodName: string;
    amount: number;
    calories: number;
    carbohydrate: number;
    protein: number;
    fat: number;
}

export interface FoodCategory {
    categoryName: string;
}

export interface FoodRecord {
    dietId: number;
    foodRes: {
        foodId: number,
        foodName: string,
        calories: number,
        fat: number,
        protein: number,
        carbohydrate: number
    };
    imageUrl?: string;
    mealType: string;
    quantity: number;
}