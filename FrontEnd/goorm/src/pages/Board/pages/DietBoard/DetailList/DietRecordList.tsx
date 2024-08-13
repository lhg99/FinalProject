import React from 'react';
import classNames from 'classnames';
import styles from './DietRecordList.module.scss';
import { BoardDetails } from '../../../types';

interface DietRecordListProps {
  records: BoardDetails['dietRecordItems']; // 식단 기록에 맞게 수정
}

const DietRecordList: React.FC<DietRecordListProps> = ({ records }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const translateMealTime = (mealTime: string): string => {
    switch (mealTime) {
      case 'BREAKFAST':
        return '아침';
      case 'LUNCH':
        return '점심';
      case 'DINNER':
        return '저녁';
      case 'SNACK':
        return '간식';
      default:
        return mealTime; // Unknown meal time will be returned as is
    }
  };

  if (!records || records.length === 0) {
    return <div className={styles.noRecords}>식단 기록이 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.pagename}>- 식단 기록 - </h3>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {['번호', '날짜', '식사 시간', '음식 이름', '칼로리', '탄수화물', '단백질', '지방', '설탕', '나트륨'].map((header, index) => (
                <th key={index} className={classNames(styles.tableHeader)} style={{ width: '60px' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => {
              const values = [
                record.dietId, // 식단 기록 번호
                formatDate(record.dietDate), // 식단 날짜
                translateMealTime(record.mealTime), // 식사 시간
                record.foodRes.foodName, // 음식 이름
                `${record.totalCalories} kcal`, // 칼로리
                `${record.foodRes.carbohydrate} g`, // 탄수화물
                `${record.foodRes.protein} g`, // 단백질
                `${record.foodRes.fat} g`, // 지방
                record.foodRes.sugar !== null ? `${record.foodRes.sugar} g` : '', // 설탕
                record.foodRes.salt !== null ? `${record.foodRes.salt} mg` : '' // 나트륨
              ];

              return (
                <tr key={record.dietId} className={classNames(styles.tableRow)}>
                  {values.map((value, index) => (
                    <td key={index} className={classNames(styles.tableCell)}>
                      {value}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DietRecordList;
