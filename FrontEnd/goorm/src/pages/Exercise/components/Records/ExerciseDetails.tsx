import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useExercise } from "../../../../contexts/exerciseContext";
import { ExerciseRecords } from "../../ExerciseTypes";
import DeleteModal from "../../../../components/Modal/Exercise/DeleteModal";
import { ModalStore } from "../../../../store/store";
import { deleteRecord } from "../../../../api/Exercise/exerciseApi";

interface ExerciseDetailProps {
  exercise: ExerciseRecords;
  isAddingExercise: boolean; // 새로운 운동 여부
}

// 운동 세부정보 입력하는 컴포넌트
const ExerciseDetails: React.FC<ExerciseDetailProps> = ({
  exercise,
  isAddingExercise
}) => {
  const [exerciseName, setExerciseName] = useState<string>(
    exercise.trainingName || ""
  );
  const [distance, setDistance] = useState<string>(
    exercise.distance?.toString() || ""
  );
  const [duration, setDuration] = useState<string>(
    exercise.durationMinutes?.toString() || "0"
  );
  const [slope, setSlope] = useState<string>(
    exercise.incline?.toString() || "0"
  );
  const [intensity, setIntensity] = useState<string>(
    exercise.intensity || ""
  );
  const [sets, setSets] = useState<string>(exercise.sets?.toString() || "0");
  const [weight, setWeight] = useState<string>(
    exercise.weight?.toString() || "0"
  );
  const [count, setCount] = useState<string>(exercise.reps?.toString() || "0");
  const prevDetailsRef = useRef(exercise);

  const {
    state: { exerciseRecords },
    updateExerciseDetails,
    removeExercise,
    updateExerciseRecords
  } = useExercise();

  const { modals, openModal, closeModal } = ModalStore();

  useEffect(() => {
    const updatedDetails = {
      ...exercise,
      trainingName: exerciseName,
      distance: distance ? parseFloat(distance) : 0,
      durationMinutes: duration ? parseInt(duration) : 0,
      incline: slope ? parseFloat(slope) : 0,
      intensity: convertIntensity(intensity),
      sets: sets ? parseInt(sets) : 0,
      weight: weight ? parseFloat(weight) : 0,
      reps: count ? parseInt(count) : 0,
    };

    const prevDetails = prevDetailsRef.current;

    // exerciseRecords에서 해당 recordId가 있는지 확인
    const existingRecord = exerciseRecords.find(
      (record) => record.recordId === exercise.recordId
    );

    // Check if updatedDetails differ from previous details
    if (JSON.stringify(updatedDetails) !== JSON.stringify(prevDetails)) {
      if (existingRecord) {
        // record가 있으면 updateExerciseRecords로 업데이트
        updateExerciseRecords(exercise.recordId, updatedDetails);
        console.log("Exercise Records Updated:", updatedDetails);
      } else {
        // record가 없으면 updateExerciseDetails로 업데이트
        updateExerciseDetails(updatedDetails);
        console.log("Exercise Details Updated:", updatedDetails);
      }
    }
    prevDetailsRef.current = updatedDetails;
  }, [
    exerciseName,
    distance,
    duration,
    slope,
    intensity,
    sets,
    weight,
    count
  ]);

  const handleModalClick = () => {
    openModal("deleteModal");
  };

  const handleModalClose = () => {
    closeModal("deleteModal");
  };

  const handleDeleteModalConfirm = async () => {
    try {
      await deleteRecord(exercise.recordId);
      removeExercise(exercise.trainingName); // 상태에서 운동 삭제
      closeModal("deleteModal");
    } catch (err) {
      throw err;
    }
  };

  const convertIntensity = (value: string): string => {
    switch (value) {
      case "가볍게":
        return "LOW";
      case "적당히":
        return "MIDDLE";
      case "격하게":
        return "HIGH";
      default:
        return "";
    }
  };

  return (
    <ExerciseDetailsContainer>
      <ExerciseInfo>
        <CategoryBadge>{exercise.categoryName}</CategoryBadge>
        <ExerciseTitle>{exercise.trainingName}</ExerciseTitle>
      </ExerciseInfo>
      <InputContainer>
        {exercise.categoryName === "유산소" ? (
          <>

            <ExerciseLabel>
              <ExerciseInput
                type="text"
                placeholder=" 시간"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  const newDuration = parseInt(e.target.value, 10);
                  if (!isNaN(newDuration)) {
                    const updatedDetails = { durationMinutes: newDuration };
                    updateExerciseRecords(exercise.recordId, updatedDetails);
                  }
                }}
              />
            </ExerciseLabel>
            <ExerciseText>분</ExerciseText>

            <ExerciseLabel>
              <ExerciseInput
                type="text"
                placeholder="거리"
                value={distance}
                onChange={(e) => {
                  setDistance(e.target.value);
                  const newDistance = parseFloat(e.target.value);
                  if (!isNaN(newDistance)) {
                    const updatedDetails = { distance: newDistance };
                    updateExerciseRecords(exercise.recordId, updatedDetails);
                  }
                }}
              />
            </ExerciseLabel>
            <ExerciseText>km</ExerciseText>

            <ExerciseLabel>
              <ExerciseInput
                type="text"
                placeholder="경사"
                value={slope}
                onChange={(e) => {
                  setSlope(e.target.value);
                  const newSlope = parseFloat(e.target.value);
                  if (!isNaN(newSlope)) {
                    const updatedDetails = { incline: newSlope };
                    updateExerciseRecords(exercise.recordId, updatedDetails);
                  }
                }}
              />
            </ExerciseLabel>
            <ExerciseText>도</ExerciseText>

            <ExerciseLabel>
              <ExerciseInput
                as="select"
                value={intensity}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  const intensityValue = convertIntensity(selectedValue);

                  setIntensity(selectedValue);
                  const updatedDetails = { intensity: intensityValue };
                  updateExerciseRecords(exercise.recordId, updatedDetails);
                }}
                >
                  <option value="" disabled>
                    강도 선택
                  </option>
                  <option value="가볍게">가볍게</option>
                  <option value="적당히">적당히</option>
                  <option value="격하게">격하게</option>
              </ExerciseInput>
            </ExerciseLabel>

          </>
        ) : (
          <>
            <SetContainer>
              <ExerciseLabel>
                <ExerciseInput
                  type="text"
                  placeholder=" 시간"
                  value={duration}
                  onChange={(e) => {
                    setDuration(e.target.value);
                    const newDuration = parseInt(e.target.value, 10);
                    if (!isNaN(newDuration)) {
                      const updatedDetails = { durationMinutes: newDuration };
                      updateExerciseRecords(exercise.recordId, updatedDetails);
                    }
                  }}
                />
              </ExerciseLabel>
              <ExerciseText>분</ExerciseText>

              <ExerciseLabel>
                <ExerciseInput
                  type="number"
                  placeholder="세트"
                  value={sets}
                  onChange={(e) => {
                    setSets(e.target.value);
                    const newSets = parseInt(e.target.value, 10);
                    if (!isNaN(newSets)) {
                      const updatedDetails = { sets: newSets };
                      updateExerciseRecords(exercise.recordId, updatedDetails);
                    }
                  }}
                />
              </ExerciseLabel>
              <ExerciseText>세트</ExerciseText>

              <ExerciseLabel>
                <ExerciseInput
                  type="number"
                  placeholder="중량(kg)"
                  value={weight}
                  step="5"
                  onChange={(e) => {
                    setWeight(e.target.value);
                    const newWeight = parseFloat(e.target.value);
                    if (!isNaN(newWeight)) {
                      const updatedDetails = { weight: newWeight };
                      updateExerciseRecords(exercise.recordId, updatedDetails);
                    }
                  }}
                />
              </ExerciseLabel>
              <ExerciseText>kg</ExerciseText>

              <ExerciseLabel>
                <ExerciseInput
                  type="number"
                  placeholder="횟수"
                  value={count}
                  onChange={(e) => {
                    setCount(e.target.value);
                    const newReps = parseInt(e.target.value, 10);
                    if (!isNaN(newReps)) {
                      const updatedDetails = { reps: newReps };
                      updateExerciseRecords(exercise.recordId, updatedDetails);
                    }
                  }}
                />
              </ExerciseLabel>
              <ExerciseText>회</ExerciseText>

              <ExerciseLabel>
                <ExerciseInput
                  as="select"
                  value={intensity}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    const intensityValue = convertIntensity(selectedValue);
                    
                    setIntensity(selectedValue);
                    const updatedDetails = { intensity: intensityValue };
                    updateExerciseRecords(exercise.recordId, updatedDetails);
                  }}
                  >
                    <option value="" disabled>
                      강도 선택
                    </option>
                    <option value="가볍게">가볍게</option>
                    <option value="적당히">적당히</option>
                    <option value="격하게">격하게</option>
                </ExerciseInput>
              </ExerciseLabel>
            </SetContainer>
          </>
        )}
        <DeleteButton onClick={handleModalClick}>삭제</DeleteButton>
      </InputContainer>
      <DeleteModal
        isOpen={modals.deleteModal?.isOpen}
        onClose={handleModalClose}
        onConfirm={handleDeleteModalConfirm}
      />
    </ExerciseDetailsContainer>
  );
};

export default ExerciseDetails;

const ExerciseDetailsContainer = styled.div`
  margin-top: 0.625rem;
  margin-left: 0.9375rem;
  display: flex;
  width: 100%;
  border: 1px solid #afafaf;
  border-radius: 0.9375rem;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  font-size: 0.875rem;
`;

const ExerciseInfo = styled.div`
  display: flex;
  align-items: center;
`;

const CategoryBadge = styled.span`
  background-color: #699732;
  color: white;
  border-radius: 0.3125rem;
  margin-left: 0.625rem;
  padding: 0.25rem;
  font-size: 0.875rem;
`;

const ExerciseTitle = styled.h3`
  font-size: 1.125rem;
  margin-left: 0.625rem;
`;

const ExerciseLabel = styled.label`
  margin-left: 0.625rem;
  display: block;
  flex-direction: row;
  margin-bottom: 1rem;
  width: 5rem;
  gap: 0;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ExerciseInput = styled.input`
  display: flex;
  width: 100%;
  padding: 0.3125rem;
  margin-top: 1.25rem;
  border: 1px solid #afafaf;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  margin-left: 0.3125rem;
  gap: 0.0625rem;

  // 스핀버튼 항상 보이게 설정하는 CSS
  -webkit-appearance: none;
  -moz-appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: inner-spin-button;
    opacity: 1;
  }
`;

const ExerciseText = styled.span`
  margin-left: 0.625rem;
`;

const SetContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DeleteButton = styled.button`
  margin-right: 0.625rem;
  margin-left: 1.25rem;
  height: 20%;
  background-color: #ff4d4d;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.875rem;

  &:hover {
    background-color: #ff1a1a;
  }
`;
