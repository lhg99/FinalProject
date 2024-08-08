import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ExerciseRecords } from './../../../pages/Exercise/ExerciseTypes';
import BarChart from './BarChart/BarChart';
import DoughnutChart from './DoughnutChart/DoughnutChart';
import styles from './ExerciseChartPage.module.scss';
import { getExerciseRecords } from '../../../api/Exercise/exerciseApi';
import { useExercise } from '../../../contexts/exerciseContext';
import ChartTabs from '../../../components/Taps/ChartTap/ChartTabs';

const ExerciseChartPage: React.FC = () => {
  const { month } = useParams<{ month: string }>();
  const [selectedTab, setSelectedTab] = useState<string>(month || 'JAN');
  const { state: {exerciseRecords,}, setExerciseRecords } = useExercise();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getExerciseRecords();
        setExerciseRecords(fetchedData);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (month) {
      setSelectedTab(month);
    }
  }, [month]);

  const filterRecordsByMonth = (records: ExerciseRecords[], month: string) => {
    const monthIndex = getMonthNumber(month);
    return records.filter(record => new Date(record.exerciseDate).getMonth() === monthIndex);
  };

  const getMonthNumber = (month: string): number => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return months.indexOf(month);
  };

  const filteredRecords = filterRecordsByMonth(exerciseRecords, selectedTab);

  const groupByExerciseName = (records: ExerciseRecords[]) => {
    const grouped = records.reduce((acc, record) => {
      const name = record.trainingName || 'Unknown';
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return {
      labels: Object.keys(grouped),
      data: Object.values(grouped),
    };
  };

  const exerciseData = groupByExerciseName(filteredRecords);

  const barChartData = {
    labels: exerciseData.labels,
    datasets: [
      {
        label: '횟수',
        data: exerciseData.data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: exerciseData.labels,
    datasets: [
      {
        data: exerciseData.data,
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

  return (
    <div className={styles.container}>
      <h2>2024</h2>
      <ChartTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className={styles.chartWrapper}>
        <div className={styles.chartContainer}>
          <BarChart data={barChartData} />
        </div>
        <div className={styles.chartContainer}>
          <DoughnutChart data={doughnutChartData} />
        </div>
      </div>
    </div>
  );
};

export default ExerciseChartPage;
