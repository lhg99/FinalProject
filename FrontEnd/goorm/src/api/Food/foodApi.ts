
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

export const postFoodRecord = async () => {
    try {
        // const response = await axiosInstance.post();
    } catch (error) {
        
    }
}

export const postCardioRecord = async (trainingId: number, exerciseRecord: null, image: File | null): Promise<void> => {
}

export const postStrengthRecord = async (): Promise<void> => {
    
}

export const deleteRecord = async(recordId: number) => {
   
}