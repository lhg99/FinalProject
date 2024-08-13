import React, { useCallback, useEffect, useState } from 'react';
import MyCalendar from '../Exercise/components/Date/Calendar';
import styles from './Food.module.scss';
import FoodSearch from './FoodSearch';
import { useFood } from '../../contexts/foodContext';
import { FoodData } from './FoodTypes';
import FoodList from './components/Records/FoodList';
import FoodMemo from './FoodMemo'
import { formatDateInfo } from '../../utils/DateUtils';
import { EditFoodRecord, postFoodMemo, postFoodRecord } from '../../api/Food/foodApi';
import FoodCategoryTable from './FoodCategoryTable';
import { EditFoodRecordRequest, PostFoodRecordRequest } from '../../api/Food/dto/FoodRequest';
import { ToastStore } from '../../store/store';
import ToastComponent from '../../components/Toast/ToastComponent';
import { getusereData } from '../../api/mypageApi';
import { useNavigate } from 'react-router-dom';

const Food: React.FC = () => {

    const [dateInfo, setDateInfo] = useState<{ year: number; month: number; day: number; weekday: string; formattedDate: string } | null>(null);

    const { showToast } = ToastStore();

    const navigate = useNavigate();

    useEffect(() => {
        const checkUserInfo = async() => {
          try {
            const userInfo = await getusereData();
            if(!userInfo.memberHeight) {
              alert("유저 추가 정보가 없습니다. 마이페이지에서 추가정보를 입력하세요.");
              navigate("/mypage");
            }
          } catch(err) {
            console.error("유저 정보 가져오기 실패", err);
          }
        }
        checkUserInfo();
      }, []);

    const handleDateChange = useCallback(
        (info: { year: number; month: number; day: number; weekday: string }) => {
          const formattedDate = formatDateInfo(info);
          setDateInfo({ ...info, formattedDate });
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
        try {
            // selectedFood 배열을 순회하여 각 항목을 처리
            for (const food of selectedFood) {
                const details = foodDetails[food.foodName] || {};
                const existingRecord = foodRecords.find(
                    (record) => record.foodRes.foodId === food.foodId
                );
    
                // PostFoodRecordRequest 객체 생성
                const foodRecordRequest: PostFoodRecordRequest = {
                    mealTime: existingRecord ? existingRecord.mealTime : food.mealTime || "",
                    dietDate: dateInfo.formattedDate,
                    foodQuantities: [{
                        foodId: food.foodId,
                        quantity: details.quantity !== 0 ? details.quantity : undefined,
                        gram: details.gram !== 0 ? details.gram : undefined
                    }],
                    totalCalories: food.calories * (details.quantity || 1), // 총 칼로리 계산
                    memo: details.memo || ""
                };
                await postFoodRecord(foodRecordRequest);
                
            }
            await postFoodMemo(memo.content, new Date(dateInfo.formattedDate));
    
            showToast("foodSaveToast", "식단 기록이 저장되었습니다.");
            window.location.reload();
        } catch (error) {
            console.error("식단 기록 저장 실패:", error);
            alert("식단 기록이 저장되지 않았습니다.");
        }
    };

    const handleEdit = async () => {
        try {
            const editRequest: EditFoodRecordRequest = {
                foodRecords: selectedFoodRecords.map(record => ({
                    dietId: record.dietId,
                    dietDate: record.dietDate,
                    mealTime: record.mealTime,
                    foodQuantities: [{
                        foodId: record.foodRes.foodId,
                        quantity: record.quantity !== null ? record.quantity : undefined,
                        gram: record.gram !== null ? record.gram : undefined,
                    }],
                    memo: memo.content,  // 메모 내용
                })),
                memos: memo,  // 메모 객체
            };
            
            // EditFoodRecord 함수 호출
            await EditFoodRecord(editRequest);
            showToast("foodEditToast", "식단 기록이 수정되었습니다.");
            window.location.reload();
        } catch (err) {
            console.error("식단 기록 수정 실패", err);
            alert("식단 기록 수정에 실패했습니다.");
        }
    };

    return (
        <div className={styles.pageBackground}>
            <div className={styles.food}>
                <ToastComponent />
                <div className={styles.foodContainer}>
                    <div className={styles.leftColumn}>
                        <div className='calendar'>
                            <MyCalendar onDateChange={handleDateChange} />
                            <FoodCategoryTable dateInfo={dateInfo}/>
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
        </div>
    );
};

export default Food;
