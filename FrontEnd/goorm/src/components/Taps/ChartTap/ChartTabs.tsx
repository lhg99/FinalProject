import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChartTabs.module.scss';

interface TabsWithButtonProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const monthTabs = [
  { key: 'JAN', label: '1월' },
  { key: 'FEB', label: '2월' },
  { key: 'MAR', label: '3월' },
  { key: 'APR', label: '4월' },
  { key: 'MAY', label: '5월' },
  { key: 'JUN', label: '6월' },
  { key: 'JUL', label: '7월' },
  { key: 'AUG', label: '8월' },
  { key: 'SEP', label: '9월' },
  { key: 'OCT', label: '10월' },
  { key: 'NOV', label: '11월' },
  { key: 'DEC', label: '12월' },
];

const ChartTabs: React.FC<TabsWithButtonProps> = ({ selectedTab, setSelectedTab }) => {
  const navigate = useNavigate();

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
    navigate(`/exercise/chart/${tab}`);
  };

  return (
    <div className={styles.parentContainer}>
      <div className={styles.tabsContainer}>
        {monthTabs.map((tab) => (
          <div
            key={tab.key}
            className={`${styles.tab} ${selectedTab === tab.key ? styles.active : ''}`}
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartTabs;
