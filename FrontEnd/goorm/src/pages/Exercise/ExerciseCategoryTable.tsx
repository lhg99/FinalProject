import React from 'react'
import { Category, ExerciseData } from '../../api/exerciseApi'
import styled from 'styled-components';

interface ExerciseCategoryTableProps {
  exercises: ExerciseData[];
  categories: Category[];
}

const ExerciseCategoryTable: React.FC<ExerciseCategoryTableProps> = ({exercises, categories}) => {
  // 각 카테고리별 운동 개수 계산
  const categoryCounts = exercises.reduce((acc, exercise) => {
    if(!acc[exercise.category_id]) {
      acc[exercise.category_id] = 0;
    }
    acc[exercise.category_id] += 1;
    return acc;
  }, {} as {[key: number]: number});

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
        {categories.filter(category => category.category_id !== 0)
          .map(category => {
            const count = categoryCounts[category.category_id] || 0;
            const percentage = totalExercises > 0 ? (count / totalExercises * 100).toFixed(2) : '0.00';
            return (
              <tr key={category.category_id}>
                <td>{category.category_name}</td>
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
  margin-top: 0.625rem;
  margin-left: 0.625rem;
  font-size: 1rem;

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