import React, { useCallback, useEffect, useState } from 'react';
import MyCalendar from '../Exercise/components/Date/Calendar';
import styles from './Food.module.scss';
import FoodSearch from './FoodSearch';
import { useFood } from '../../contexts/foodContext';
import { FoodData, FoodRecord } from './FoodTypes';
import FoodList from './components/Records/FoodList';
import FoodMemo from './FoodMemo'
import { formatDateInfo } from '../../utils/DateUtils';
import { EditFoodRecord, postFoodMemo, postFoodRecord } from '../../api/Food/foodApi';
import { formatDate } from 'react-datepicker/dist/date_utils';

const Food: React.FC = () => {

    const [dateInfo, setDateInfo] = useState<{ year: number; month: number; day: number; weekday: string; formattedDate: string } | null>(null);

    const handleDateChange = useCallback(
        (info: { year: number; month: number; day: number; weekday: string }) => {
          const formattedDate = formatDateInfo(info); // Format the date as a string
          setDateInfo({ ...info, formattedDate }); // Store both the original info and formatted date
        },[]
    );

    const {state: {foodRecords, selectedFood, foodDetails, memo, selectedFoodRecords}, addFood, addCustomFood} = useFood();

    const handleAddFood = useCallback((food: FoodData) => {
        console.log("handleAddFood 호출", food);
        addFood(food);
    }, [addFood]);

    const handleAddCustomFood = useCallback((food: FoodData, MealTime: string) => {
        console.log("handleAddCustomFood 호출", food, MealTime);
        addCustomFood(food, MealTime);
        addFood(food);
    }, [addCustomFood, addFood]);

    const handleSave = async () => {
        if (!dateInfo) {
            alert("날짜를 선택해주세요.");
            return;
        }
    
        for (const food of selectedFood) {
            const details = foodDetails[food.foodName] || {};
            const existingRecord = foodRecords.find(
                (record) => record.foodRes.foodId === food.foodId
            );
    
            const record: FoodRecord = {
                dietId: existingRecord ? existingRecord.dietId : new Date().getTime(), // 새로운 기록일 경우 고유한 dietId 생성
                mealTime: existingRecord ? existingRecord.mealTime : food.mealTime || "",
                dietDate: dateInfo.formattedDate,
                quantity: details.quantity || 0,
                gram: details.gram || 0,  // 기존 gram 대신 foodDetails에서 가져온 값
                totalCalories: food.calories * (details.quantity || 1), // 총 칼로리 계산
                memo: details.memo || "",
                foodRes: {
                    foodId: food.foodId,
                    foodName: food.foodName,
                    calories: food.calories,
                    fat: food.fat,
                    protein: food.protein,
                    carbohydrate: food.carbohydrate,
                    sugar: food.sugar,
                    salt: food.salt,
                    cholesterol: food.cholesterol,
                    saturatedFat: food.saturatedFat,
                    transFat: food.transFat
                }
            };
            try {
                await postFoodRecord(record.foodRes.foodId, record);
                await postFoodMemo(memo.content, new Date(dateInfo.formattedDate)); // date 객체로 전달
                alert("식단 기록이 저장되었습니다.");
            } catch (error) {
                console.error("식단 기록 저장 실패:", error);
                alert("식단 기록이 저장되지 않았습니다.");
            }
        }
    };

    const handleEdit = async () => {
        try {
          // Loop through exerciseRecords to send each record for editing
          await EditFoodRecord(selectedFoodRecords, memo);
          // await postExerciseMemo(memo.content);
          alert("식단 기록이 수정되었습니다.");
        } catch (err) {
          console.error("식단기록 수정 실패", err);
        }
      };

    return (
        <div className={styles.food}>
            <div className={styles.foodContainer}>
                <div className={styles.leftColumn}>
                    <div className='calendar'>
                        <MyCalendar onDateChange={handleDateChange} />
                        {dateInfo && (
                            <p>{`${dateInfo.month}월 식단`}</p>
                        )}
                    </div>
                </div>
                <div className={styles.rightColumn}>
                    {dateInfo && (
                        <div className={styles.dateInfo}>
                            <p className={styles.dateText}>{`${dateInfo.year}년 ${dateInfo.month}월 ${dateInfo.day}일 ${dateInfo.weekday}`}</p>
                        </div>
                    )}
                    <div className={styles.searchListContainer}>
                        <div className={styles.searchColumn}>
                            <FoodSearch onAddFood={handleAddFood} onAddCustomFood={handleAddCustomFood}/>
                            <FoodList food={selectedFood} dateInfo={dateInfo} />
                        </div>
                    </div>
                </div>
            </div>
            <FoodMemo dateInfo={dateInfo}/>
            <div className={styles.buttonContainer}>
                <button className={styles.saveButton} onClick={handleEdit}>
                수정하기
                </button>
                <button className={styles.saveButton} onClick={handleSave}>
                저장하기
                </button>
            </div>
        </div>
    );
};

export default Food;
