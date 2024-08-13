import React, { useEffect, useState } from 'react';
import styles from './FoodRecordsList.module.scss';
import { getFoodRecord } from '../../../../../api/Food/foodApi'; 
import { FoodRecord } from '../../../../Food/FoodTypes';

interface FoodRecordsListProps {
  selectedMonth: string;
  selectedRecords: string[];
  handleRecordSelect: (recordId: number) => void;
}

const FoodRecordsList: React.FC<FoodRecordsListProps> = ({ selectedMonth, selectedRecords, handleRecordSelect }) => {
  const [foodRecords, setFoodRecord] = useState<FoodRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<FoodRecord[]>([]);

  const monthMapping: { [key: string]: number } = {
    JAN: 0,
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11,
  };

  useEffect(() => {
    const fetchFoodRecords = async () => {
      try {
        const records = await getFoodRecord();
        setFoodRecord(records);
        console.log('Fetched food records:', records);
      } catch (error) {
        console.error('식단 기록을 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchFoodRecords();
  }, []);

  useEffect(() => {
    const filterRecordsByMonth = () => {
      const monthIndex = monthMapping[selectedMonth];
      const filtered = foodRecords
        .filter(record => {
          const recordMonth = new Date(record.dietDate).getMonth();
          return recordMonth === monthIndex;
        })
        .sort((a, b) => new Date(b.dietDate).getTime() - new Date(a.dietDate).getTime());
      setFilteredRecords(filtered);
      console.log(`Filtered records for month ${selectedMonth}:`, filtered);
    };

    filterRecordsByMonth();
  }, [selectedMonth, foodRecords]);

  return (
    <div className={styles.foodList}>
      <table>
        <thead>
          <tr>
            <th>선택</th>
            <th>날짜</th>
            <th>식사 종류</th>
            <th>음식</th>
            <th>칼로리</th>
            <th>메모</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map(record => (
            <tr key={record.dietId}>
              <td>
                <input 
                  type="checkbox" 
                  checked={selectedRecords.includes(record.dietId.toString())} 
                  onChange={() => handleRecordSelect(record.dietId)} 
                />
              </td>
              <td>{record.dietDate}</td>
              <td>{record.mealTime}</td>
              <td>{record.foodRes.foodName}</td>
              <td>{record.totalCalories} kcal</td>
              <td>{record.memo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodRecordsList;
