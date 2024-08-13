import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ExerciseCount, TotalExerciseData } from "./ExerciseTypes";
import { useExercise } from "../../contexts/exerciseContext";
import { getExercisePercentage, getTotalData } from "../../api/Exercise/exerciseApi";
import DateSelector from "./components/Date/DateSelector";
import { formatDate } from "../../utils/DateUtils";

interface ExerciseCategoryTableProps {
  startDate: Date;
  endDate: Date;
  onHandleStartDate: (date: Date) => void;
  onHandleEndDate: (date: Date) => void;
  dateInfo: {
    year: number;
    month: number;
    day: number;
    weekday: string;
    formattedDate: string;
  } | null;
}

const ExerciseCategoryTable = ({startDate, endDate, onHandleStartDate, onHandleEndDate, dateInfo}: ExerciseCategoryTableProps) => {
  const [data, setData] = useState<ExerciseCount | null>(null);
  const [totalExerciseData, setTotalExerciseData] = useState<TotalExerciseData | null>(null);

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
    if (!dateInfo) {
      console.warn("dateInfo가 null입니다. 데이터를 가져올 수 없습니다.");
      return;
    }

    const fetchCalorie = async() => {
      try {
        const response = await getTotalData(new Date(dateInfo.formattedDate));
        setTotalExerciseData(response);
        return response.data;
      } catch (error) {
        console.error("getTotalData 실패", error);
      }
    }
    fetchCalorie();
  }, [dateInfo]);
  

  return (
    <div>
      <ExerciseInfo>유산소 칼로리 소모량: <span className="highlight">{totalExerciseData?.totalCaloriesBurned}</span> kcal</ExerciseInfo>
      <br></br>
      <ExerciseInfo>총 운동 시간 : <span className="highlight">{totalExerciseData?.totalDurationMinutes}</span> 분</ExerciseInfo>
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
    margin-left: 0.625rem;

    .highlight {
        font-size: 30px;
    }
`;

const PercentageTd = styled.td`
  text-align: center;
`;
