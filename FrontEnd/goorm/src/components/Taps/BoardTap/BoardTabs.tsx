import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BoardTabs.module.scss';
import { BoardType } from '../../../pages/Board/types';

interface TabsWithButtonProps {
  selectedTab: BoardType;
  setSelectedTab: (tab: BoardType) => void;
}

const Boardtabs = [
  { key: BoardType.FREE, label: '자유게시판', path: '/Board/free', writePath: '/Board/free/createpost' },
  { key: BoardType.WORKOUT, label: '운동게시판', path: '/Board/exercise', writePath: '/Board/exercise/record' },
  { key: BoardType.DIET, label: '식단게시판', path: '/Board/diet', writePath: '/Board/diet/record' },
];

const getBoardTitle = (boardType: BoardType): string => {
  const tab = Boardtabs.find(t => t.key === boardType);
  return tab ? tab.label : '자유게시판';
};

const BoardTabs: React.FC<TabsWithButtonProps> = ({ selectedTab, setSelectedTab }) => {
  const navigate = useNavigate();

  const handleTabClick = (tab: BoardType) => {
    setSelectedTab(tab);
    const currentTab = Boardtabs.find(t => t.key === tab);
    if (currentTab) {
      navigate(currentTab.path);
    }
  };

  const renderButton = () => {
    const currentTab = Boardtabs.find(tab => tab.key === selectedTab);
    if (!currentTab) return null;

    return (
      <button
        className={styles.recordButton}
        onClick={() => navigate(currentTab.writePath)}
      >
        {selectedTab === BoardType.FREE ? '게시글 작성' : '기록 공유'}
      </button>
    );
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
        {renderButton()}
      </div>
    </div>
  );
};

export default BoardTabs;
