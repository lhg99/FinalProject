import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';
import styles from './DietRecordList.module.scss';
import { getFoodRecord } from '../../../api/Food/foodApi';
import RecodsTabs from '../../../components/Taps/ExerciseListTab/ExerciseRecordsTabs';
import { FoodRecord } from "../FoodTypes";
import { useFood } from '../../../contexts/foodContext';

const DietRecordList: React.FC = () => {
  const { month } = useParams<{ month: string }>();
  const [selectedTab, setSelectedTab] = useState<string>(month || 'JAN');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recordsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [allRecords, setAllRecords] = useState<FoodRecord[]>([]);
  const [currentRecords, setCurrentRecords] = useState<FoodRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const { setFoodRecord } = useFood();

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const records = await getFoodRecord();
        setFoodRecord(records); // Set records in the context
        setAllRecords(records); // Set records as an array for local use
      } catch (error) {
        console.error("Failed to fetch records", error);
      }
    };
    fetchRecords();
  }, []);

  useEffect(() => {
    filterRecords(allRecords, selectedTab);
  }, [selectedTab, currentPage, searchQuery, allRecords]);

  const filterRecords = (records: FoodRecord[], month: string) => {
    const filteredRecords = records.filter(record => {
      const recordMonth = new Date(record.dietDate).getMonth();
      return getMonthNumber(month) === recordMonth;
    });
    console.log('Filtered records:', filteredRecords);
    setCurrentRecords(filteredRecords);
    setTotalPages(Math.ceil(filteredRecords.length / recordsPerPage));
  };

  const getMonthNumber = (month: string): number => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return months.indexOf(month);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  return (
    <div className={styles.container}>
      <RecodsTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} basePath="/food/records" />
      <div className={styles.tableContainer}>
        <table className={styles.diettable}>
          <thead>
            <tr>
              {['날짜', '식사 종류', '음식', '칼로리', '탄수화물', '단백질', '지방'].map((header, index) => (
                <th key={index} className={classNames(styles.tableHeader)} style={{ width: '80px' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRecords.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage).map((record) => {
              const values = [
                // record.dietId,
                formatDate(record.dietDate),
                record.mealTime,
                record.foodRes.foodName,
                record.foodRes.calories !== null ? `${record.foodRes.calories} kcal` : '',
                record.foodRes.carbohydrate !== null ? `${record.foodRes.carbohydrate} g` : '',
                record.foodRes.protein !== null ? `${record.foodRes.protein} g` : '',
                record.foodRes.fat !== null ? `${record.foodRes.fat} g` : ''
              ];
              return (
                <tr key={record.dietId} className={classNames(styles.tableRow)}>
                  {values.map((value, index) => (
                    <td key={index} className={classNames(styles.tableCell)}>
                      {value}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DietRecordList;
