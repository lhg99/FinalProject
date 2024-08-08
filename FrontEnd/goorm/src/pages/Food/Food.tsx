import React, { useCallback, useEffect, useState } from 'react';
import MyCalendar from '../Exercise/components/Date/Calendar';
import styles from './Food.module.scss';
import FoodSearch from './FoodSearch';
import { useFood } from '../../contexts/foodContext';
import { FoodData } from './FoodTypes';
import FoodList from './components/Records/FoodList';
import { formatDateInfo } from '../../utils/DateUtils';

const Food: React.FC = () => {

    const [dateInfo, setDateInfo] = useState<{ year: number; month: number; day: number; weekday: string; formattedDate: string } | null>(null);

    const handleDateChange = useCallback(
        (info: { year: number; month: number; day: number; weekday: string }) => {
          const formattedDate = formatDateInfo(info); // Format the date as a string
          setDateInfo({ ...info, formattedDate }); // Store both the original info and formatted date
        },[]
    );

    const {state: {selectedFood}, addFood, addCustomFood} = useFood();

    const handleAddFood = useCallback((food: FoodData) => {
        console.log("handleAddFood 호출", food);
        addFood(food);
    }, [addFood]);

    const handleAddCustomFood = useCallback((food: FoodData, mealType: string) => {
        console.log("handleAddCustomFood 호출", food, mealType);
        addCustomFood(food, mealType);
        addFood(food);
    }, [addCustomFood, addFood]);

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
            <button className={styles.saveButton}>저장하기</button>
        </div>
    );
};

export default Food;
