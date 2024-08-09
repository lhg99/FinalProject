import React, { useCallback, useEffect, useState } from 'react';
import MyCalendar from '../Exercise/components/Date/Calendar';
import styles from './Food.module.scss';
import FoodSearch from './FoodSearch';
import { useFood } from '../../contexts/foodContext';
import { FoodData, FoodRecord } from './FoodTypes';
import FoodList from './components/Records/FoodList';
import { formatDateInfo } from '../../utils/DateUtils';
import { postFoodRecord } from '../../api/Food/foodApi';

const Food: React.FC = () => {

    const [dateInfo, setDateInfo] = useState<{ year: number; month: number; day: number; weekday: string; formattedDate: string } | null>(null);

    const handleDateChange = useCallback(
        (info: { year: number; month: number; day: number; weekday: string }) => {
          const formattedDate = formatDateInfo(info); // Format the date as a string
          setDateInfo({ ...info, formattedDate }); // Store both the original info and formatted date
        },[]
    );

    const {state: {foodRecords, selectedFood, foodDetails}, addFood, addCustomFood} = useFood();

    const handleAddFood = useCallback((food: FoodData) => {
        console.log("handleAddFood 호출", food);
        addFood(food);
    }, [addFood]);

    const handleAddCustomFood = useCallback((food: FoodData, mealType: string) => {
        console.log("handleAddCustomFood 호출", food, mealType);
        addCustomFood(food, mealType);
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
                mealType: existingRecord ? existingRecord.mealType : food.mealType || "",
                dietDate: dateInfo.formattedDate,
                quantity: details.quantity || 1,
                gram: details.gram || 100, // 기본 gram 값 설정 (필요시 수정)
                totalCalories: food.calories * (details.quantity || 1), // 총 칼로리 계산
                memo: details.memo || "",
                foodRes: {
                    foodId: food.foodId,
                    foodName: food.foodName,
                    calories: food.calories,
                    fat: food.fat,
                    protein: food.protein,
                    carbohydrate: food.carbohydrate,
                }
            };
    
            try {
                await postFoodRecord(record.foodRes.foodId.toString(), record);
                console.log("식단 기록 저장 성공:", record);
                alert("식단 기록이 저장되었습니다.");
            } catch (error) {
                console.error("식단 기록 저장 실패:", error);
                alert("식단 기록이 저장되지 않았습니다.");
            }
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
            <button className={styles.saveButton} onClick={handleSave}>저장하기</button>
        </div>
    );
};

export default Food;
