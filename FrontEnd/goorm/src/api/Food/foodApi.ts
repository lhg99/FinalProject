
import { memo } from "react";
import { DietMemo, FoodData, FoodRecord } from "../../pages/Food/FoodTypes";
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

export const postCustomFoodData = async (): Promise<number> => {
    try {
        const response = await axiosInstance.post<{id: number}>(`/food`);
        console.log("유저 입력 음식 등록 성공: ", response.data);
        return response.data.id;
    } catch(err) {
        console.error("유저 입력 음식 등록 실패: ", err);
        throw err;
    }
}

export const postFoodRecord = async (foodId: number, record: FoodRecord) => {
    const formData = new FormData();
    const data = {
        mealTime: record.mealTime,
        dietDate: record.dietDate,
        foodQuantities: [
            {
                foodId: foodId,
                quantity: record.quantity ? record.quantity : null,
                gram: record.gram ? record.gram : null 
            }
        ],
        totalCalories: record.totalCalories,
        memo: record.memo
    }

    formData.append("diet", JSON.stringify(data));
    try {
        const response = await axiosInstance.post('/diet', formData, {
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

export const postFoodMemo = async(memo: string, dateInfo: Date) => {
    const request = {
        "content" : memo,
        "date": formatDate(dateInfo)
    }
    try {
        const response = await axiosInstance.post(`/diet/dietMemo`, request);
        console.log("운동 메모 post 성공!!", response.data);
    } catch (error) {
        console.error("운동 메모 post 실패", error);
    }
}

export const EditFoodRecord = async (foodRecords: FoodRecord[], memos: DietMemo): Promise<void> => {
    const requestData = foodRecords.map(foodRecord => ({
      dietId: foodRecord.dietId,
      dietDate: foodRecord.dietDate,
      mealTime: foodRecord.mealTime,
      foodQuantities: [{
        foodId: foodRecord.foodRes.foodId,
        quantity: foodRecord.quantity,
        gram: foodRecord.gram
      }],
      memo: memos.content
    }));
    try {
      const response = await axiosInstance.put(`diet/edit-multiple`, requestData);
      console.log("식단 기록 수정 성공", response.data);
    } catch (err) {
      console.error("식단 기록 수정 오류", err);
    }
  };

export const deleteFoodRecord = async(dietId: number) => {
    try {
        const response = await axiosInstance.delete(`/diet/${dietId}`);
        console.log("식단 기록 삭제 성공", response.data);
    } catch(err) {
        console.error("식단 기록 삭제 실패: ", err);
    }
}