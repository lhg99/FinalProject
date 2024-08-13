import React, { useEffect, useMemo } from "react";
import ExerciseDetails from "./ExerciseDetails";
import styled from "styled-components";
import { useExercise } from "../../../../contexts/exerciseContext";
import { ExerciseData, ExerciseRecords } from "../../ExerciseTypes";
import { getExerciseRecords } from "../../../../api/Exercise/exerciseApi";
interface ExerciseListProps {
  exercises: ExerciseData[];
  dateInfo: {
    year: number;
    month: number;
    day: number;
    weekday: string;
    formattedDate: string;
  } | null;
}

const ExerciseList = ({exercises,dateInfo}: ExerciseListProps) => {
    const {
      state: { selectedExercises, exerciseRecords, selectedExerciseRecords },
      setExerciseRecords,
      setSelectedExerciseRecords,
    } = useExercise();

    useEffect(() => {
      const fetchRecords = async () => {
        try {
          const records = await getExerciseRecords();
          setExerciseRecords(records);
        } catch (error) {
          console.error("Failed to fetch exercise records", error);
        }
      };
      fetchRecords();
    }, []);

    useEffect(() => {
      if (!dateInfo) {
        console.log("No dateInfo provided");
        setSelectedExerciseRecords([]);
        return;
      }

      const { year, month, day } = dateInfo;
      const selectedDate = new Date(year, month - 1, day);

      if (!Array.isArray(exerciseRecords)) {
        console.log("No exercise records found");
        setSelectedExerciseRecords([]);
        return;
      }

      const records = exerciseRecords.filter((record) => {
        const recordDate = new Date(record.exerciseDate);
        return (
          recordDate.getFullYear() === selectedDate.getFullYear() &&
          recordDate.getMonth() === selectedDate.getMonth() &&
          recordDate.getDate() === selectedDate.getDate()
        );
      });

      setSelectedExerciseRecords(records);
    }, [dateInfo, exerciseRecords]);

    const filteredRecords = useMemo(() => {
      return selectedExerciseRecords.map((record) => {
        const exercise = exercises.find(
          (ex) =>
            ex.name.replace(/\s+/g, "").toLowerCase() ===
            record.trainingName.replace(/\s+/g, "").toLowerCase()
        );
        if (exercise) {
          return {
            ...record,
            id: exercise.id,
            name: exercise.name,
            isNew: false,
          };
        } else {
          return { ...record, id: 0, name: "Unknown Exercise", isNew: false };
        }
      });
    }, [selectedExerciseRecords, exercises]);

    const combinedRecords = useMemo(() => {
        if (!Array.isArray(exerciseRecords)) {
          console.log('No exercise records found');
          return [];
        }
      
        const maxRecordId = Math.max(0, ...exerciseRecords.map(record => record.recordId));
      
        const selectedExerciseRecords: ExerciseRecords[] = selectedExercises.map((exercise, index) => ({
          recordId: maxRecordId + index + 1,
          trainingName: exercise.name,
          exerciseDate: dateInfo ? dateInfo.formattedDate : '',
          sets: 0,
          weight: 0,
          distance: 0,
          durationMinutes: 0,
          caloriesBurned: 0,
          incline: 0,
          reps: 0,
          satisfaction: 0,
          intensity: '',
          categoryName: exercise.categoryName,
          trainingId: exercise.id,
          isAddingExercise: exercise.isAddingExercise ? true : false,
        }));
      
        return [...filteredRecords, ...selectedExerciseRecords];
      }, [filteredRecords, exerciseRecords, selectedExercises]);
    return (
        <ExerciseListWrapper>
            <ExerciseTextContainer>
                <ExerciseText>오늘의 운동 목록</ExerciseText>
            </ExerciseTextContainer>
            <ExerciseListContainer>
                {combinedRecords.length > 0 ? (
                combinedRecords.map((record) => (
                    <ExerciseDetails
                    key={record.recordId}
                    exercise={record}
                    isAddingExercise={record.isAddingExercise as boolean}
                    />
                ))
                ) : (
                <ExerciseTextContainer>
                    <ExerciseText>운동기록 없음</ExerciseText>
                </ExerciseTextContainer>
                )}
            </ExerciseListContainer>
        </ExerciseListWrapper>
    );
};

export default ExerciseList;

const ExerciseListWrapper = styled.div`
  width: 100%;
  max-height: 36.25rem;
  overflow-y: auto;
  border-radius: 5px;
  border-left: none;
  box-sizing: content-box;
`;

const ExerciseTextContainer = styled.div`
  margin-top: 0.625rem;
`;

const ExerciseText = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
  margin-left: 0.9375rem;
`;

// 스크롤 넣는 css
const ExerciseListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 97%;
  margin-top: 0.625rem;
`;
