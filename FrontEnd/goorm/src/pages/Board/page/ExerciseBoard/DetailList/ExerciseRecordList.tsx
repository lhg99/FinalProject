import React from 'react';
import classNames from 'classnames';
import styles from './ExerciseRecordList.module.scss';
import { BoardDetails } from '../../../types';

interface ExerciseRecordListProps {
  records: BoardDetails['trainingRecordItems'];
}

const ExerciseRecordList: React.FC<ExerciseRecordListProps> = ({ records }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  if (!records || records.length === 0) {
    return <div className={styles.noRecords}>운동 기록이 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <h2>운동 기록</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {['번호', '날짜', '카테고리', '운동', '시간', '칼로리', '세트', '횟수', '중량', '거리', '경사'].map((header, index) => (
                <th key={index} className={classNames(styles.tableHeader)} style={{ width: '60px' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => {
              const values = [
                record.recordId,
                formatDate(record.exerciseDate),
                record.categoryName === '유산소' ? record.categoryName : `근력 / ${record.categoryName}`,
                record.trainingName,
                record.durationMinutes !== null ? `${record.durationMinutes} 분` : '',
                record.caloriesBurned !== null ? `${record.caloriesBurned} kcal` : '',
                record.sets !== null ? `${record.sets} 세트` : '',
                record.reps !== null ? `${record.reps} 회` : '',
                record.weight !== null ? `${record.weight} kg` : '',
                record.distance !== null ? `${record.distance} km` : '',
                record.incline !== null ? `${record.incline} incline` : ''
              ];
              return (
                <tr key={record.recordId} className={classNames(styles.tableRow)}>
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

export default ExerciseRecordList;
