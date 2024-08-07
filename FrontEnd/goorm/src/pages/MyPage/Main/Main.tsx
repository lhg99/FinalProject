import React, { useCallback, useState } from 'react';
import styles from './Main.module.scss';
import MyCalendar from '../../Exercise/components/Date/Calendar';

const MainPage: React.FC = () => {
  const [dateInfo, setDateInfo] = useState<{ year: number, month: number, day: number, weekday: string } | null>(null);

  const handleDateChange = useCallback((info: { year: number, month: number, day: number, weekday: string }) => {
    setDateInfo(info);
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <h1>캐릭터</h1>
      </div>
      <div className={styles.rightPane}>
        <div className={styles.buttons}>
          <button>Button 1</button>
          <button>Button 2</button>
        </div>
        <div className={styles.calPane}>
          <MyCalendar onDateChange={handleDateChange} />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
