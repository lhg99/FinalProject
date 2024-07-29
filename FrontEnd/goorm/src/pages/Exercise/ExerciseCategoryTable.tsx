import React from 'react'
import { Category, ExerciseData } from './api/exerciseApi'
import styled from 'styled-components';

interface ExerciseCategoryTableProps {
  exercises: ExerciseData[];
  categories: Category[];
}

const ExerciseCategoryTable: React.FC<ExerciseCategoryTableProps> = ({exercises, categories}) => {
  // 각 카테고리별 운동 개수 계산
  const categoryCounts = exercises.reduce((acc, exercise) => {
    if(!acc[exercise.id]) {
      acc[exercise.categoryName] = 0;
    }
    acc[exercise.categoryName] += 1;
    return acc;
  }, {} as {[key: string]: number});

  // 전체운동 계산
  const totalExercises = exercises.length;

  return (
    <Table>
      <thead>
        <tr>
          <th>카테고리 구분</th>
          <th>달성률</th>
        </tr>
      </thead>
      <tbody>
        {categories.filter(category => category.categoryName !== "전체")
          .map((category, index) => {
            const count = categoryCounts[category.categoryName] || 0;
            const percentage = totalExercises > 0 ? (count / totalExercises * 100).toFixed(2) : '0.00';
            return (
              <tr key={index}>
                <td>{category.categoryName}</td>
                <PercentageTd>{percentage} %</PercentageTd>
              </tr>
            )}
          )
        }
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