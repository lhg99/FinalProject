
export interface FoodQuantity {
    foodId: number;
    quantity?: number | null;
    gram?: number | null;
}

export interface PostFoodRecordRequest {
    mealTime: string;
    dietDate: string;
    foodQuantities: FoodQuantity[];
    totalCalories: number;
    memo?: string;
}

export interface PostFoodMemoRequest {
    content: string;
    date: string;
}

export interface EditFoodRecordRequest {
    foodRecords: {
      dietId: number;
      dietDate: string;
      mealTime: string;
      foodQuantities: FoodQuantity[];
      memo?: string;
    }[];
    memos: {
      content: string;
    };
  }
