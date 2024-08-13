import React from 'react';
import classNames from 'classnames';
import styles from './DietBoardPage.module.scss'
import { BoardDetails } from '../../../types';

interface DietRecordListProps {
  records: BoardDetails['trainingRecordItems'];
}

const DietRecordList: React.FC<DietRecordListProps> = ({ records }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
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
                record.recordId,
                formatDate(record.exerciseDate), // 이 부분도 식단에 맞게 수정 필요
                record.categoryName, // 이 부분도 식단에 맞게 수정 필요
                record.trainingName, // 이 부분도 식단에 맞게 수정 필요
                record.caloriesBurned !== null ? `${record.caloriesBurned} kcal` : '', // 이 부분도 식단에 맞게 수정 필요
                record.sets !== null ? `${record.sets} g` : '', // 탄수화물 양으로 수정 필요
                record.reps !== null ? `${record.reps} g` : '', // 단백질 양으로 수정 필요
                record.weight !== null ? `${record.weight} g` : '', // 지방 양으로 수정 필요
                record.distance !== null ? `${record.distance} g` : '', // 설탕 양으로 수정 필요
                record.incline !== null ? `${record.incline} mg` : '' // 나트륨 양으로 수정 필요
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

export default DietRecordList;
