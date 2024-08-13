import { FoodData, FoodRecord } from "../../pages/Food/FoodTypes";
import { formatDate } from "../../utils/DateUtils";
import axiosInstance from "../axiosInstance";
import { EditFoodRecordRequest, PostFoodRecordRequest } from "./dto/FoodRequest";


export const getFoodData = async (): Promise<FoodData[]> => {
    try {
        const response = await axiosInstance.get<FoodData[]>('/food/all');
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
        return response.data;
    } catch (error) {
        console.error("음식 이름 검색 실패", error);
    }
}

export const getFoodRecord = async (): Promise<FoodRecord[]> => {
    try {
        const response = await axiosInstance.get<FoodRecord[]>('/diet/all');
        return response.data;
    } catch(err) {
        console.error("식단기록 가져오기 실패", err);
        throw err;
    }
}

export const getFoodPercentage = async(dateInfo: Date) => {
    const params = {
        date: formatDate(dateInfo)
    }
    try {
        const response = await axiosInstance.get("/diet/nutrient", { params });
        return response.data;
    } catch (error) {
        console.error("음식 퍼센트 가져오기 실패", error);
    }
}

export const postCustomFoodData = async (): Promise<number> => {
    try {
        const response = await axiosInstance.post<{id: number}>(`/food`);
        return response.data.id;
    } catch(err) {
        console.error("유저 입력 음식 등록 실패: ", err);
        throw err;
    }
}

export const postFoodRecord = async (request: PostFoodRecordRequest) => {
    const formData = new FormData();

    const foodQuantity = request.foodQuantities[0];

    const data = {
        mealTime: request.mealTime,
        dietDate: request.dietDate,
        foodQuantities: [{
            foodId: foodQuantity.foodId,
            quantity: foodQuantity.quantity !== undefined ? foodQuantity.quantity : undefined,
            gram: foodQuantity.gram !== undefined ? foodQuantity.gram : undefined,
        }],
        totalCalories: request.totalCalories,
        memo: request.memo,
    };

    formData.append("diet", JSON.stringify(data));
    try {
        const response = await axiosInstance.post('/diet', formData, {
            headers: {
                'Content-Type':'multipart/form-data'
            }
        });

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
        return response.data;
    } catch (error) {
        console.error("식단 메모 post 실패", error);
    }
}

export const EditFoodRecord = async (request: EditFoodRecordRequest): Promise<void> => {
    const requestData = request.foodRecords.map(foodRecord => ({
      dietId: foodRecord.dietId,
      dietDate: foodRecord.dietDate,
      mealTime: foodRecord.mealTime,
      foodQuantities: foodRecord.foodQuantities,
      memo: request.memos.content
    }));
    try {
      const response = await axiosInstance.put(`diet/edit-multiple`, requestData);
      return response.data;
    } catch (err) {
      console.error("식단 기록 수정 오류", err);
    }
  };

export const deleteFoodRecord = async(dietId: number) => {
    try {
        const response = await axiosInstance.delete(`/diet/${dietId}`);
        return response.data;
    } catch(err) {
        console.error("식단 기록 삭제 실패: ", err);
    }
}