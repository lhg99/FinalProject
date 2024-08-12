import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import FoodDetails from "./FoodDetails";
import { FoodData, FoodRecord } from "../../FoodTypes";
import { useFood } from "../../../../contexts/foodContext";
import { getFoodRecord } from "../../../../api/Food/foodApi";
import FoodInfoModal from "../../../../components/Modal/Food/FoodInfoModal";
import { ModalStore } from "../../../../store/store";
import { MEAL_TIMES, mealTimeLabels } from './../../../../constants/Food/MealTime';

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
  const { state: { selectedFood, foodRecords, selectedFoodRecords }, setFoodRecord, setSelectedFoodRecords} = useFood();

  const {modals, openModal, closeModal } = ModalStore();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const records = await getFoodRecord();
        setFoodRecord(records); // Set records as an array
      } catch (error) {
        console.error("fetchRecords 실패", error);
      }
    };
    fetchRecords();
  }, [dateInfo]);

  useEffect(() => {
    if (!dateInfo) {
      console.log("No dateInfo provided");
      setSelectedFoodRecords([]); // 상태 초기화
      return;
    }

    const { year, month, day } = dateInfo;
    const selectedDate = new Date(year, month - 1, day);

    if (!Array.isArray(foodRecords)) {
      console.log("No food records found");
      setSelectedFoodRecords([]); // 상태 초기화
      return;
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
  }, [dateInfo, foodRecords]);

  const filteredRecords = useMemo(() => {
    return selectedFoodRecords.map((record) => {
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
  }, [selectedFoodRecords, food]);

  const combinedRecords = useMemo(() => {
    if (!Array.isArray(foodRecords)) {
      console.log("No food records found");
      return [];
    }

    const maxRecordId = Math.max(
      0,
      ...foodRecords.map((record) => record.dietId)
    );

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
          transFat: food.transFat,
        },
        totalCalories: food.calories * 0,
        memo: "",
      };
    });

    return [...filteredRecords, ...selectedFoodRecords];
  }, [filteredRecords, foodRecords, selectedFood, dateInfo]);

  // mealTime별로 묶은 record
  const groupedRecords = useMemo(() => {
    const groups: { [key in keyof typeof MEAL_TIMES]: FoodRecord[] } = {
      BREAKFAST: [],
      LUNCH: [],
      DINNER: [],
      SNACK: [],
      OTHER: []
    };

    combinedRecords.forEach((record) => {
      const mealTimeKey = record.mealTime as keyof typeof groups;
      if (mealTimeKey in groups) {
        groups[mealTimeKey].push(record);
      }
    });

    return groups;
  }, [combinedRecords]);

  const handleModalOpen = () => {
    openModal("foodInfo");
  }

  return (
    <FoodListWrapper>
      <FoodTextContainer>
        <FoodText>오늘의 음식 목록</FoodText>
        <DetailButton onClick={handleModalOpen}>상세 정보</DetailButton>
      </FoodTextContainer>
      <FoodListContainer>
        {Object.entries(groupedRecords).map(([mealTime, records]) => (
            <React.Fragment key={mealTime}>
              {records.length > 0 && (
                <>
                  <MealTimeHeading>{mealTimeLabels[mealTime as keyof typeof mealTimeLabels]}</MealTimeHeading>
                  {records.map((record) => (
                    <FoodDetails key={record.dietId} food={record} />
                  ))}
                </>
              )}
            </React.Fragment>
          ))}
      </FoodListContainer>
      <FoodInfoModal isOpen={modals.foodInfo?.isOpen} onClose={() => closeModal("foodInfo")} />
    </FoodListWrapper>
  );
};

export default FoodList;

const FoodListWrapper = styled.div`
  width: 100%;
  max-height: 36.25rem;
  overflow-y: auto;
  border-radius: 5px;
  border-left: none;
  box-sizing: content-box;
`;

const FoodTextContainer = styled.div`
  margin-top: 0.625rem;
  display: flex; /* Flexbox로 변경 */
  align-items: center; /* 수직 중앙 정렬 */
`;

const FoodText = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
  margin-left: 0.9375rem;
`;

const DetailButton = styled.button`
  margin-left: auto;
  margin-right: 0.9375rem;
  margin-top: 0.3125rem;
  padding: 0.25rem 0.5rem;
  background-color: white;
  border: 1px solid #AFAFAF;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #699732;
  }
`;

const FoodListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 97%;
  margin-top: 0.3125rem;
`;

const MealTimeHeading = styled.h3`
  font-size: 1.25rem;
  margin-left: 0.9375rem;
`;
