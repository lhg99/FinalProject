import React from 'react'
import { ExerciseData } from '../../../../api/exerciseApi';
import ExerciseDetails from './ExerciseDetails';
import styled from 'styled-components';

interface ExerciseListProps {
  exercises: ExerciseData[];
}

// 운동을 나열하는 컴포넌트
const ExerciseList: React.FC<ExerciseListProps> = ({exercises}) => {
  return (
    <ExerciseListContainer>
      {exercises.map(exercise => (
        <ExerciseDetails 
          key={exercise.training_name} 
          exercise={exercise} 
          isNew={!exercise.training_name}
        />
      ))}
    </ExerciseListContainer>
  )
}

export default ExerciseList;

// 스크롤 넣는 css
const ExerciseListContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 34.375rem;
  overflow-y: auto;
  margin-top: 0;
  gap: 0.625rem;
  padding: 0.625rem;
  border: 1px solid #ccc;
  border-radius: 0.625rem;
`;