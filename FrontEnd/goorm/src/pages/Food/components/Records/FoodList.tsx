import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components';
import { FoodData } from '../../FoodTypes';
// import { getDietRecord } from '../../api/foodApi';
import { useFood } from '../../../../contexts/foodContext';

interface FoodListProps {
  food: FoodData[];
  dateInfo: { year: number, month: number, day: number, weekday: string } | null;
  onExerciseNameChange: (name: string) => void
}

// 운동을 나열하는 컴포넌트
const FoodList: React.FC<FoodListProps> = ({ food, dateInfo, onExerciseNameChange }) => {

  // const { 
  //   state: { selectedFood, foodRecords }, 
  //   setFoodRecords 
  // } = useFood();

  // useEffect(() => {
  //   const fetchRecords = async () => {
  //     try {
  //       const records = await getDietRecord();
  //       setFoodRecords(records);
  //     } catch (error) {
  //       console.error('Failed to fetch exercise records', error);
  //     }
  //   };
  //   fetchRecords();
  // }, []);

  // const filteredRecords = useMemo(() => {
  //   if (!dateInfo) {
  //     console.log('No dateInfo provided');
  //     return [];
  //   }
  //   const { year, month, day } = dateInfo;
  //   const selectedDate = new Date(year, month - 1, day);

  //   const records = foodRecords.filter(record => {
  //     const recordDate = new Date(record.exerciseDate);
  //     return (
  //       recordDate.getFullYear() === selectedDate.getFullYear() &&
  //       recordDate.getMonth() === selectedDate.getMonth() &&
  //       recordDate.getDate() === selectedDate.getDate()
  //     );
  //   });

  //   return records.map(record => {
  //     const foodData = food.find(ex => ex.foodName.replace(/\s+/g, '').toLowerCase() === record.trainingName.replace(/\s+/g, '').toLowerCase());
  //     if (food) {
  //       return { ...record, id: food.foodId, name: food.foodName, isNew: false };
  //     } else {
  //       return { ...record, id: 0, name: "Unknown Exercise", isNew: false }; // Provide default values for id and name
  //     }
  //   });
  // }, [dateInfo, exerciseRecords, exercises]);

  // const combinedRecords = useMemo(() => {
  //   const maxRecordId = Math.max(0, ...exerciseRecords.map(record => record.recordId));

  //   const selectedExerciseRecords: ExerciseRecords[] = selectedExercises.map((exercise) => ({
  //     recordId: maxRecordId + 1, // 기존 maxRecordId에 index를 더해 recordId를 증가
  //     trainingName: exercise.name,
  //     exerciseDate: new Date().toISOString(), // 현재 날짜로 설정
  //     sets: 0,
  //     weight: 0,
  //     distance: 0,
  //     durationMinutes: 0,
  //     caloriesBurned: 0,
  //     incline: 0,
  //     reps: 0,
  //     satisfaction: 0, // 기본값 설정, 실제 값을 설정해야 할 수 있음
  //     intensity: '',
  //     categoryName: exercise.categoryName,
  //     trainingId: exercise.id,
  //     isAddingExercise: exercise.isAddingExercise ? true : false
  //   }));

  //   return [...filteredRecords, ...selectedExerciseRecords];
  // }, [filteredRecords, exerciseRecords, selectedExercises]); // Add selectedExercises to the dependency array

  return (
    <FoodListWrapper>
      {/* <FoodTextContainer>
        <FoodText>오늘의 운동 목록</FoodText>
      </FoodTextContainer>
      <FoodListContainer>
        {combinedRecords.length > 0 ? (
          combinedRecords.map(record => (
            <FoodDetails
              key={record.recordId}
              exercise={record}
              isAddingExercise={record.isAddingExercise as boolean}
              details={record}
              onExerciseNameChange={onExerciseNameChange}
            />
          ))
        ) : (
          <FoodTextContainer>
            <FoodText>운동기록 없음</FoodText>
          </FoodTextContainer>
        )}
      </FoodListContainer> */}
    </FoodListWrapper>
  );
};

export default FoodList;

const FoodListWrapper = styled.div`
  width: 100%;
  max-height: 34.6875rem;
  overflow-y: auto;
  border: 1px solid #AFAFAF;
  border-radius: 5px;
  border-left: none;
  box-sizing: content-box;
`;

const FoodTextContainer = styled.div`
  margin-top: 0.625rem;
`;

const FoodText = styled.span`
  font-weight: bold;
  font-size: 1.25rem;
  margin-left: 0.9375rem;
`;

// 스크롤 넣는 css
const FoodListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 97%;
  margin-top: 0.625rem;
`;
