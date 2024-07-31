import React from 'react';
import styles from './Main.module.scss';

const MainPage: React.FC = () => {
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
        <div className={styles.extraPane}>
          <h2>달력</h2>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
