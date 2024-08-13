import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FoodRecord } from '../../../pages/Food/FoodTypes';
import styles from './DietChartPage.module.scss';
import { getFoodRecord } from '../../../api/Food/foodApi';
import { useFood } from '../../../contexts/foodContext';
import ChartTabs from '../../../components/Taps/ChartTap/ChartTabs';
import ScatterChart from '../DietChart/ScatterChart/ScatterChart';
import DoughnutChart from '../DietChart/DoughnutChart/DoughnutChart';
import BarChart from '../DietChart/BarChart/BarChart';

const DietChartPage: React.FC = () => {
  const { month } = useParams<{ month: string }>();
  const [selectedTab, setSelectedTab] = useState<string>(month || 'AUG');
  const { state: { foodRecords }, setFoodRecord } = useFood();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getFoodRecord();
        setFoodRecord(fetchedData);
      } catch (error) {
        console.error('Error fetching food records:', error);
      }
    };

    fetchData();
  }, [setFoodRecord]);

  useEffect(() => {
    if (month) {
      setSelectedTab(month);
    }
  }, [month]);

  const getMonthNumber = (month: string): number => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return months.indexOf(month);
  };

  const filterRecordsByMonth = (records: FoodRecord[], month: string) => {
    const monthIndex = getMonthNumber(month);
    return records.filter(record => new Date(record.dietDate).getMonth() === monthIndex);
  };

  const groupByFoodName = (records: FoodRecord[]) => {
    return records.reduce((acc, record) => {
      const foodName = record.foodRes.foodName || 'Unknown';
      acc[foodName] = (acc[foodName] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  };

  const filteredRecords = filterRecordsByMonth(foodRecords, selectedTab);
  const foodData = groupByFoodName(filteredRecords);

  const barChartData = {
    labels: Object.keys(foodData),
    datasets: [
      {
        label: '횟수',
        data: Object.values(foodData),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: Object.keys(foodData),
    datasets: [
      {
        data: Object.values(foodData),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FFCD56',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FFCD56',
        ],
      },
    ],
  };

  const scatterChartData = filteredRecords.map(record => ({
    x: new Date(record.dietDate),
    y: record.foodRes.calories, // y축 값은 해당 날짜의 칼로리로 설정
  }));

  return (
    <div className={styles.container}>
      <ChartTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} basePath="/diet/chart" /> 
      <div className={styles.chartWrapper}>
        <div className={styles.chartContainer}>
          <BarChart data={barChartData} />
        </div>
        <div className={styles.chartContainer}>
          <DoughnutChart data={doughnutChartData} />
        </div>
        <div className={styles.chartContainer}>
          <ScatterChart data={scatterChartData} month={selectedTab} />
        </div>
      </div>
    </div>
  );
};

export default DietChartPage;
