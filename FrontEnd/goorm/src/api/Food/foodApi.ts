
import { memo } from "react";
import { FoodData, FoodRecord } from "../../pages/Food/FoodTypes";
import { formatDate } from "../../utils/DateUtils";
import axiosInstance from "../axiosInstance";


export const getFoodData = async (): Promise<FoodData[]> => {
    try {
        const response = await axiosInstance.get<FoodData[]>('/food/all');
        console.log("음식 정보", response.data);
        return response.data;
    } catch (err) {
        console.error("음식 정보 가져오기 실패", err);
        throw err;
    }
};

export const getFoodByName = async (foodName: string) => {
    const params = {
        name: foodName
    };
    try {
        const response = await axiosInstance.get("/food", {params});
        console.log("음식 이름으로 검색 성공", response.data);
        return response.data;
    } catch (error) {
        console.error("음식 이름 검색 실패", error);
    }
}

export const getFoodRecord = async (): Promise<FoodRecord[]> => {
    try {
        const response = await axiosInstance.get<FoodRecord[]>('/diet/all');
        console.log("식단기록 가져오기 성공: ", response.data);
        return response.data;
    } catch(err) {
        console.error("식단기록 가져오기 실패", err);
        throw err;
    }
}

export const getFoodPercentage = async (startDate: Date, endDate: Date) => {
}

export const postFoodRecord = async (foodId: string, record: FoodRecord) => {
    const formData = new FormData();
    const data = {
        dietId: record.dietId,
        mealType: record.mealType,
        dietDate: record.dietDate,
        foodQuantities: [
            {
                foodId: foodId,
                quantity: record.quantity,
                gram: record.gram
            }
        ],
        totalCalories: record.totalCalories,
        memo: record.memo
    }

    formData.append("diet", JSON.stringify(data));
    try {
        const response = await axiosInstance.post('/diets', formData, {
            headers: {
                'Content-Type':'multipart/form-data'
            }
        });

        console.log("식단 기록 등록 성공", response.data);
        return response.data;
    } catch (error) {
        console.error("식단 기록 등록 실패", error);
    }
}