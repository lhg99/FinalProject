import React, { useEffect, useMemo } from 'react'
import { ExerciseData, ExerciseRecords, getExerciseRecords } from '../../../../api/exerciseApi';
import ExerciseDetails from './ExerciseDetails';
import styled from 'styled-components';
import { ExerciseStore } from '../../../../store/store';

interface ExerciseListProps {
  exercises: ExerciseData[];
  dateInfo: { year: number, month: number, day: number, weekday: string } | null;
}

// 운동을 나열하는 컴포넌트
const ExerciseList: React.FC<ExerciseListProps> = ({exercises, dateInfo}) => {

  const { exerciseRecords, setExerciseRecords } = ExerciseStore();

  useEffect(() => {
    const fetchRecords = async () => {
        try {
            const records = await getExerciseRecords();
            setExerciseRecords(records);
        } catch (error) {
            console.error('Failed to fetch exercise records', error);
        }
    };

    fetchRecords();
}, [setExerciseRecords]);

  const filteredRecords = useMemo(() => {
    if(!dateInfo) return [];
    const { year, month, day } = dateInfo;
    const selectedDate = new Date(year, month - 1, day);

    return exerciseRecords.filter(record => {
      const recordDate = new Date(record.record_date);
      return (
        recordDate.getFullYear() === selectedDate.getFullYear() &&
        recordDate.getMonth() === selectedDate.getMonth() &&
        recordDate.getDate() === selectedDate.getDate()
      );
    });
  }, [dateInfo, exerciseRecords]);

  return (
    <ExerciseListWrapper>
      <ExerciseText>오늘의 운동 목록</ExerciseText>
      <ExerciseListContainer>
        {filteredRecords.length > 0 ? (
          filteredRecords.map(record => (
            <ExerciseDetails 
              key={record.training_id} 
              exercise={exercises.find(ex => ex.training_id === record.training_id) || { training_name: "", category_id: 0, training_id: 0 }} 
              isNew={!record.training_id}
              details={record}
            />
          ))
        ) : (
          <p>운동기록 없음</p>
        )}
      </ExerciseListContainer>
    </ExerciseListWrapper>
  )
}

export default ExerciseList;

const ExerciseListWrapper = styled.div `
  width: 100%;
  height: 32.5rem;
  max-height: 32.5rem;
  overflow-y: auto;
  border: 1px solid black;
  border-radius: 5px;
  box-sizing: content-box;
  padding-right: 0.5rem;
`

const ExerciseText = styled.span`
  font-weight: bold;
  font-size: 1.25rem;
  margin-left: 0.9375rem;
`

// 스크롤 넣는 css
const ExerciseListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 0.625rem;
  gap: 0.625rem;
`;