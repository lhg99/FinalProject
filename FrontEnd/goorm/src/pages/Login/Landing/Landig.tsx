import React, { useEffect, useState } from "react";
import styles from "./Landing.module.scss";

const Landing: React.FC = () => {
  const [h1Loaded, setH1Loaded] = useState(false);
  const [h2Loaded, setH2Loaded] = useState(false);

  useEffect(() => {
    const h1Timer = setTimeout(() => {
      setH1Loaded(true);
    }, 500);

    return () => clearTimeout(h1Timer);
  }, []);

  useEffect(() => {
    const h2Timer = setTimeout(() => {
      setH2Loaded(true);
    }, 1200);

    return () => clearTimeout(h2Timer);
  }, []);

  return (
    <div className={styles.pageBackground}>
      <section id="main-title" className={`${styles.section} ${h1Loaded ? styles.loaded : ""}`}>
        <div className={styles.content}>
          <h1>건강한 운동 습관</h1>
          <h2>이디핏과 함께하세요</h2>
        </div>
      </section>
      <section id="main-button" className={`${styles.section} ${h2Loaded ? styles.loaded : ""}`}>
        <div className={styles.content}>
          <div className={styles["button-container"]}>
            <button>지금 바로 시작해 보세요</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
