import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BoardTabs.module.scss';

interface TabsWithButtonProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const Boardtabs = [
  { key: 'FREE', label: '자유게시판', writePath: '/Board/free/createpost' },
  { key: 'EXERCISE', label: '운동 공유', writePath: '/Board/exercise/record' },
  { key: 'DIET', label: '식단 공유', writePath: '/Board/diet/createpost' },
];

const getBoardTitle = (boardType: string): string => {
  const tab = Boardtabs.find(t => t.key === boardType);
  return tab ? tab.label : '자유게시판';
};

const BoardTabs: React.FC<TabsWithButtonProps> = ({ selectedTab, setSelectedTab }) => {
  const navigate = useNavigate();

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
    const path = `/Board/${tab.toLowerCase()}`;
    navigate(path);
  };

  const renderWriteButton = () => {
    const currentTab = Boardtabs.find(Boardtabs => Boardtabs.key === selectedTab);
    return currentTab ? (
      <button className={styles.writeButton} onClick={() => navigate(currentTab.writePath)}>
        게시글 작성
      </button>
    ) : null;
  };

  return (
    <div className={styles.parentContainer}>
      <div className={styles.tabsContainer}>
        {Boardtabs.map(tab => (
          <div
            key={tab.key}
            className={`${styles.tab} ${selectedTab === tab.key ? styles.active : ''}`}
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <h1 className={styles.pageTitle}>{getBoardTitle(selectedTab)}</h1>
      <div className={styles.buttonContainer}>
        {renderWriteButton()}
      </div>
    </div>
  );
};

export default BoardTabs;
