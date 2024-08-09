import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import FoodDetails from "./FoodDetails";
import { FoodData, FoodRecord } from "../../FoodTypes";
import { useFood } from "../../../../contexts/foodContext";
import { getFoodRecord } from "../../../../api/Food/foodApi";

interface FoodListProps {
  food: FoodData[];
  dateInfo: {
    year: number;
    month: number;
    day: number;
    weekday: string;
    formattedDate: string;
  } | null;
}

const FoodList = ({ food, dateInfo }: FoodListProps) => {
  const {
    state: {
      selectedFood,
      foodRecords,
      selectedFoodRecords,
    },
    setFoodRecord,
    setSelectedFoodRecords
  } = useFood();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const records = await getFoodRecord();
        setFoodRecord(records); // Set records as an array
      } catch (error) {
        console.error('Failed to fetch exercise records', error);
      }
    };
    fetchRecords();
  }, [dateInfo]);

  const filteredRecords = useMemo(() => {
    if (!dateInfo) {
      console.log('No dateInfo provided');
      return [];
    }

    const { year, month, day } = dateInfo;
    const selectedDate = new Date(year, month - 1, day);

    if (!Array.isArray(foodRecords)) {
      console.log('No food records found');
      return [];
    }

    const records = foodRecords.filter((record) => {
      const recordDate = new Date(record.dietDate);
      return (
        recordDate.getFullYear() === selectedDate.getFullYear() &&
        recordDate.getMonth() === selectedDate.getMonth() &&
        recordDate.getDate() === selectedDate.getDate()
      );
    });

    setSelectedFoodRecords(records);

    return records.map((record) => {
      const foodInfo = food.find(
        (ex) =>
          ex.foodName.replace(/\s+/g, "").toLowerCase() ===
          record.foodRes.foodName.replace(/\s+/g, "").toLowerCase()
      );
      if (foodInfo) {
        return {
          ...record,
          id: foodInfo.foodId,
          name: foodInfo.foodName,
          isNew: false,
        };
      } else {
        return { ...record, id: 0, name: "Unknown Food", isNew: false };
      }
    });
  }, [dateInfo, foodRecords, food]);

  const combinedRecords = useMemo(() => {
    if (!Array.isArray(foodRecords)) {
      console.log('No food records found');
      return [];
    }

    const maxRecordId = Math.max(0, ...foodRecords.map(record => record.dietId));

    const selectedFoodRecords: FoodRecord[] = selectedFood.map((food) => {
      return {
        dietId: maxRecordId + 1,
        dietDate: dateInfo?.formattedDate || "",
        mealTime: food.mealTime || "",
        quantity: 0,
        dietMemo: "",
        gram: 0,
        foodRes: {
          foodId: food.foodId,
          foodName: food.foodName,
          calories: food.calories,
          fat: food.fat,
          protein: food.protein,
          carbohydrate: food.carbohydrate,
          salt: food.salt,
          sugar: food.sugar,
          cholesterol: food.cholesterol,
          saturatedFat: food.saturatedFat,
          transFat: food.transFat
        },
        totalCalories: food.calories * 0,
        memo: "",
      };
    });

    return [...filteredRecords, ...selectedFoodRecords];
  }, [filteredRecords, foodRecords, selectedFood, dateInfo]);

  return (
    <FoodListWrapper>
      <FoodTextContainer>
        <FoodText>오늘의 음식 목록</FoodText>
      </FoodTextContainer>
      <FoodListContainer>
        {combinedRecords.length > 0 ? (
          combinedRecords.map((record) => (
            <FoodDetails
              key={record.dietId}
              food={record}
            />
          ))
        ) : (
          <FoodTextContainer>
            <FoodText>음식 기록 없음</FoodText>
          </FoodTextContainer>
        )}
      </FoodListContainer>
    </FoodListWrapper>
  );
};

export default FoodList;

const FoodListWrapper = styled.div`
  width: 100%;
  max-height: 36.25rem;
  overflow-y: auto;
  border: 1px solid #afafaf;
  border-radius: 5px;
  border-left: none;
  box-sizing: content-box;
`;

const FoodTextContainer = styled.div`
  margin-top: 0.625rem;
`;

const FoodText = styled.span`
  font-weight: bold;
  font-size: 1.25rem;
  margin-left: 0.9375rem;
`;

const FoodListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 97%;
  margin-top: 0.625rem;
`;
