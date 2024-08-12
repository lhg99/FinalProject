import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ExerciseCount } from "./ExerciseTypes";
import { useExercise } from "../../contexts/exerciseContext";
import { getExercisePercentage } from "../../api/Exercise/exerciseApi";
import DateSelector from "./components/Date/DateSelector";

interface ExerciseCategoryTableProps {
  startDate: Date;
  endDate: Date;
  onHandleStartDate: (date: Date) => void;
  onHandleEndDate: (date: Date) => void;
}

const ExerciseCategoryTable = ({startDate, endDate, onHandleStartDate, onHandleEndDate}: ExerciseCategoryTableProps) => {
  const [data, setData] = useState<ExerciseCount | null>(null);
  const [totalCalories, setTotalCalories] = useState<number | undefined>(undefined);
  const {state: {exerciseRecords}} = useExercise();

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

  useEffect(() => {
    // 유산소 운동의 첫 번째 기록의 totalCaloriesBurned 값을 가져옴
    const cardioRecord = exerciseRecords.find(record => record.categoryName === "유산소");
    setTotalCalories(cardioRecord?.totalCaloriesBurned);
  }, [exerciseRecords]);


  return (
    <div>
      <ExerciseInfo>유산소 칼로리 소모량: <span className="highlight">{totalCalories?.toFixed(2)}</span> kcal</ExerciseInfo>
      <DateSelector
                startDate={startDate}
                endDate={endDate}
                onHandleStartDate={onHandleStartDate}
                onHandleEndDate={onHandleEndDate}
      ></DateSelector>
      <Table>
        <thead>
          <tr>
            <th>카테고리 구분</th>
            <th>비율</th>
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
    </div>
  );
};

export default ExerciseCategoryTable;

const Table = styled.table`
  width: 95%;
  align-items: center;
  text-align: left;
  border-collapse: collapse;
  border: 1px solid black;
  margin-top: 1.25rem;
  margin-left: 0.625rem;
  font-size: 0.875rem;

  th,
  td {
    border: 1px solid black;
    padding: 0.5rem;
  }

  th {
    background-color: #FFBDBD;
    text-align: center;
  }

  tbody {
    background-color: white;
  }
`;

const ExerciseInfo = styled.span`
    font-size: 1.25rem;
    margin-right: 0.625rem;

    .highlight {
        font-size: 30px;
    }
`;

const PercentageTd = styled.td`
  text-align: center;
`;
