import React, { useEffect, useMemo } from 'react'
import { ExerciseData, ExerciseRecords, getExerciseRecords } from '../../api/exerciseApi';
import ExerciseDetails from './ExerciseDetails';
import styled from 'styled-components';
import { ExerciseStore } from '../../../../store/store';

interface ExerciseListProps {
  exercises: ExerciseData[];
  dateInfo: { year: number, month: number, day: number, weekday: string } | null;
}

// 운동을 나열하는 컴포넌트
const ExerciseList: React.FC<ExerciseListProps> = ({exercises, dateInfo}) => {

  const { selectedExercises, exerciseRecords, setExerciseRecords } = ExerciseStore();

  useEffect(() => {
    const fetchRecords = async () => {
        try {
            const records = await getExerciseRecords();
            setExerciseRecords(records);
            // console.log("운동 기록: ", records);
        } catch (error) {
            console.error('Failed to fetch exercise records', error);
        }
    };
    fetchRecords();
}, [setExerciseRecords]);

  const filteredRecords = useMemo(() => {
    if(!dateInfo) {
      console.log('No dateInfo provided');
      return [];
    }
    const { year, month, day } = dateInfo;
    const selectedDate = new Date(year, month - 1, day);

    const records = exerciseRecords.filter(record => {
      const recordDate = new Date(record.exerciseDate);
      return (
        recordDate.getFullYear() === selectedDate.getFullYear() &&
        recordDate.getMonth() === selectedDate.getMonth() &&
        recordDate.getDate() === selectedDate.getDate()
      );
    });

    return records.map(record => {
      const exercise = exercises.find(ex => ex.name.replace(/\s+/g, '').toLowerCase() === record.trainingName.replace(/\s+/g, '').toLowerCase());
      console.log("exercise:", exercise);
      if (exercise) {
        return { ...record, id: exercise.id, name: exercise.name };
      } else {
        return { ...record, id: 0, name: "Unknown Exercise" }; // Provide default values for id and name
      }
    });
  }, [dateInfo, exerciseRecords, exercises]);

  const combinedRecords = useMemo(() => {
    const maxRecordId = Math.max(0, ...exerciseRecords.map(record => record.recordId));

    const selectedExerciseRecords: ExerciseRecords[] = selectedExercises.map((exercise, index) => ({
      recordId: maxRecordId + index + 1, // 기존 maxRecordId에 index를 더해 recordId를 증가
      trainingName: exercise.name,
      exerciseDate: new Date().toISOString(), // 현재 날짜로 설정
      sets: null,
      weight: null,
      distance: null,
      durationMinutes: 0,
      caloriesBurned: null,
      incline: null,
      reps: null,
      satisfaction: 0, // 기본값 설정, 실제 값을 설정해야 할 수 있음
      intensity: '',
      categoryName: exercise.categoryName,
      trainingId: exercise.id
    }));

    return [...filteredRecords, ...selectedExerciseRecords];
  }, [filteredRecords, selectedExercises, exerciseRecords]);

  return (
    <ExerciseListWrapper>
      <ExerciseText>오늘의 운동 목록</ExerciseText>
        <ExerciseListContainer>
          {combinedRecords.length > 0 ? (
            combinedRecords.map(record => {
                return (
                  <ExerciseDetails
                    key={record.recordId}
                    exercise={record}
                    isNew={!record.recordId}
                    details={record}
                  />
                );
            })
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
  border: 1px solid #AFAFAF;
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