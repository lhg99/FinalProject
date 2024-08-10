import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 임포트합니다.
import styles from './Main.module.scss';
import MyCalendar from '../../Exercise/components/Date/Calendar';

const MainPage: React.FC = () => {
  const [dateInfo, setDateInfo] = useState<{ year: number, month: number, day: number, weekday: string } | null>(null);
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 가져옵니다.

  const handleDateChange = useCallback((info: { year: number, month: number, day: number, weekday: string }) => {
    setDateInfo(info);
  }, []);

  const handleExerciseRecordClick = () => {
    navigate('/exercise');
  };

  const handleDietRecordClick = () => {
    navigate('/food');
  };

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        <div className={styles.leftPane}>
          <h1>캐릭터</h1>
        </div>
        <div className={styles.rightPane}>
          <div className={styles.buttons}>
            <button className={styles.button1} onClick={handleExerciseRecordClick}>
              <div className={styles.buttonContent}>
                <span>운동 기록</span>
              </div>
            </button>
            <button className={styles.button2} onClick={handleDietRecordClick}>
              <div className={styles.buttonContent}>
                <span>식단 기록</span>
              </div>
            </button>
          </div>
          <div className={styles.calPane}>
            <MyCalendar onDateChange={handleDateChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;