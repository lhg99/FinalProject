import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { ExerciseCount } from './ExerciseTypes';
import { useExercise } from '../../contexts/exerciseContext';
import { getExercisePercentage } from './api/exerciseApi';

const ExerciseCategoryTable: React.FC = () => {
  const [data, setData] = useState<ExerciseCount | null>(null);

  const { 
    state: { startDate, endDate }
} = useExercise();

useEffect(() => {
  const fetchData = async () => {
      try {
        const response = await getExercisePercentage(startDate, endDate);
        setData(response);
      } catch (err) {
        console.error("데이터를 가져오는 데 실패했습니다.", err);
      }
  };

  fetchData();
}, [startDate, endDate]);

  return (
    <Table>
      <thead>
        <tr>
          <th>카테고리 구분</th>
          <th>달성률</th>
        </tr>
      </thead>
      <tbody>
        {data ? (
          Object.entries(data).map(([categoryName, { percentage }]) => (
            <tr key={categoryName}>
              <td>{categoryName}</td>
              <PercentageTd>{percentage.toFixed(2)} %</PercentageTd>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={2}>위에 날짜를 선택해주세요</td>
          </tr>
        )}
      </tbody>
    </Table>
  )
}

export default ExerciseCategoryTable

const Table = styled.table`
  width: 95%;
  align-items: center;
  text-align: left;
  border-collapse: collapse;
  border: 1px solid black;
  margin-top: 1.25rem;
  margin-left: 0.625rem;
  font-size: 0.875rem;

  th, td {
  border: 1px solid #bbb;
  padding: 0.5rem;
  }

  th {
    background-color: #333;
    color: white;
    text-align: center;
  }
`;

const PercentageTd = styled.td`
  text-align: center;
`;