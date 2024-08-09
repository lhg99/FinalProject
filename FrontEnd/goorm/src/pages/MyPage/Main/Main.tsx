import React, { useCallback, useState } from 'react';
import styles from './Main.module.scss';
import MyCalendar from '../../Exercise/components/Date/Calendar';

const MainPage: React.FC = () => {
  const [dateInfo, setDateInfo] = useState<{ year: number, month: number, day: number, weekday: string } | null>(null);

  const handleDateChange = useCallback((info: { year: number, month: number, day: number, weekday: string }) => {
    setDateInfo(info);
  }, []);

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>
        <div className={styles.leftPane}>
          <h1>캐릭터</h1>
        </div>
        <div className={styles.rightPane}>
          <div className={styles.buttons}>
            <button className={styles.button1}>
              <div className={styles.buttonContent}>
                <span>운동 기록</span>
              </div>
            </button>
            <button className={styles.button2}>
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
