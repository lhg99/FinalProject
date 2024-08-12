import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useExercise } from "../../contexts/exerciseContext";
import { getExercisePercentage } from "../../api/Exercise/exerciseApi";
import { FoodCount } from "./FoodTypes";
import { getFoodPercentage } from "../../api/Food/foodApi";
import { mealTimeLabels } from "../../constants/Food/MealTime";

interface FoodCategoryTableProps {
    dateInfo: {
        year: number;
        month: number;
        day: number;
        weekday: string;
        formattedDate: string;
    } | null;
}

const FoodCategoryTable = ({dateInfo}: FoodCategoryTableProps) => {
  const [data, setData] = useState<FoodCount | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!dateInfo) {
        console.warn("dateInfo가 null입니다. 데이터를 가져올 수 없습니다.");
        return;
      }

      try {
        const response = await getFoodPercentage(new Date(dateInfo.formattedDate));
        setData(response);
      } catch (err) {
        console.error("데이터를 가져오는 데 실패했습니다.", err);
      }
    };

    fetchData();
  }, [dateInfo]);

  console.log("퍼센트 데이터: ", data);

  return (
    <FoodCategoryContainer>
        <FoodInfo>오늘 섭취한 칼로리: <span className="highlight">{data?.TOTAL?.totalCalories || 0}</span> kcal</FoodInfo>
      {data ? (
        Object.keys(mealTimeLabels).map((mealTime) => {
          const mealData = data[mealTime];
          if (mealData) {
            return (
              <TableContainer key={mealTime}>
                <TableTitle>{mealTimeLabels[mealTime as keyof typeof mealTimeLabels]}</TableTitle>
                <Table>
                  <thead>
                    <tr>
                      <th>탄수화물</th>
                      <th>단백질</th>
                      <th>지방</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{mealData.carbsPercentage}%</td>
                      <td>{mealData.proteinPercentage}%</td>
                      <td>{mealData.fatPercentage}%</td>
                    </tr>
                  </tbody>
                </Table>
              </TableContainer>
            );
          }
          return null;
        })
      ) : (
        <p>데이터가 없습니다. 날짜를 선택하세요.</p>
      )}
    </FoodCategoryContainer>
  );
};

export default FoodCategoryTable;

const FoodCategoryContainer = styled.div`
    margin-top: 20px;
`

const FoodInfo = styled.span`
    font-size: 1.25rem;
    margin-left: 0.625rem;

    .highlight {
        font-size: 30px;
    }
`;

const TableContainer = styled.div`
  margin-top: 1.25rem;
  margin-bottom: 2rem;
`;

const TableTitle = styled.h3`
  margin-bottom: 0.3125rem;
  margin-left: 0.625rem;
`;

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
    text-align: center;
  }

  th {
    background-color: #FFBDBD;
    text-align: center;
  }

  tbody {
    background-color: white;
  }
`;
