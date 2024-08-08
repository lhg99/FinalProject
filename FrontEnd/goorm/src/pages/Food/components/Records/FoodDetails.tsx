import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useExercise } from "../../../../contexts/exerciseContext";
import { ModalStore } from "../../../../store/store";
import { deleteRecord } from "../../../../api/Exercise/exerciseApi";
import { FoodRecord } from "../../FoodTypes";
import { useFood } from "../../../../contexts/foodContext";

interface FoodDetailProps {
  food: FoodRecord;
  isAddingFood: boolean; // 새로운 운동 여부
}

// 운동 세부정보 입력하는 컴포넌트
const FoodDetails: React.FC<FoodDetailProps> = ({
  food,
  isAddingFood,
}) => {
//   const [foodName, setFoodName] = useState<string>(
//     exercise.trainingName || ""
//   );
//   const [fat, setFat] = useState<string>(
//     food.foodRes.fat?.toString() || ""
//   );
//   const prevDetailsRef = useRef(food);

//   const {
//     state: { selectedRecords, foodRecords },
//     updateExerciseDetails,
//     removeFood,
//     setSelectedRecord,
//     updateExerciseRecords
//   } = useFood();

//   const { modals, openModal, closeModal } = ModalStore();

//   useEffect(() => {
//     const updatedDetails = {
//       ...food,

//     };

//     const prevDetails = prevDetailsRef.current;

//     // exerciseRecords에서 해당 recordId가 있는지 확인
//     const existingRecord = foodRecords.find(
//       (record) => record.dietId === food.dietId
//     );

//     // Check if updatedDetails differ from previous details
//     if (JSON.stringify(updatedDetails) !== JSON.stringify(prevDetails)) {
//       if (existingRecord) {
//         // record가 있으면 updateExerciseRecords로 업데이트
//         updateExerciseRecords(food.dietId, updatedDetails);
//         console.log("Exercise Records Updated:", updatedDetails);
//       } else {
//         // record가 없으면 updateExerciseDetails로 업데이트
//         updateExerciseDetails(updatedDetails);
//         console.log("Exercise Details Updated:", updatedDetails);
//       }
//     }
//     prevDetailsRef.current = updatedDetails;
//   }, []);

//   const handleModalClick = () => {
//     openModal("deleteModal");
//   };

//   const handleModalClose = () => {
//     closeModal("deleteModal");
//   };

//   const handleDeleteModalConfirm = async () => {
//     try {
//       await deleteRecord(food.dietId);
//     //   removeFood(food.foodRes.foodName); // 상태에서 운동 삭제
//       closeModal("deleteModal");
//     } catch (err) {
//       throw err;
//     }
//   };

  return (
    <FoodDetailsContainer>
      {/* <FoodInfo>
        <CategoryBadge>{exercise.categoryName}</CategoryBadge>
        <FoodTitle>{exercise.trainingName}</FoodTitle>
      </FoodInfo>
      <InputContainer>
        
          <>
            <SetContainer>
              <FoodLabel>
                <FoodInput
                  type="text"
                  placeholder=" 시간"
                  value={duration}
                  onChange={(e) => {
                    setDuration(e.target.value);
                    const newDuration = parseInt(e.target.value, 10);
                    if (!isNaN(newDuration)) {
                      const updatedDetails = { durationMinutes: newDuration };
                      updateExerciseRecords(details.recordId, updatedDetails);
                    }
                  }}
                />
              </FoodLabel>
              <FoodText>분</FoodText>
              <FoodLabel>
                <FoodInput
                  type="number"
                  placeholder="세트"
                  value={sets}
                  onChange={(e) => {
                    setSets(e.target.value);
                    const newSets = parseInt(e.target.value, 10);
                    if (!isNaN(newSets)) {
                      const updatedDetails = { sets: newSets };
                      updateExerciseRecords(details.recordId, updatedDetails);
                    }
                  }}
                />
              </FoodLabel>
              <FoodText>세트</FoodText>
              <FoodLabel>
                <FoodInput
                  type="number"
                  placeholder="중량(kg)"
                  value={weight}
                  step="5"
                  onChange={(e) => {
                    setWeight(e.target.value);
                    const newWeight = parseFloat(e.target.value);
                    if (!isNaN(newWeight)) {
                      const updatedDetails = { weight: newWeight };
                      updateExerciseRecords(details.recordId, updatedDetails);
                    }
                  }}
                />
              </FoodLabel>
              <FoodText>kg</FoodText>
              <FoodLabel>
                <FoodInput
                  type="number"
                  placeholder="횟수"
                  value={count}
                  onChange={(e) => {
                    setCount(e.target.value);
                    const newReps = parseInt(e.target.value, 10);
                    if (!isNaN(newReps)) {
                      const updatedDetails = { reps: newReps };
                      updateExerciseRecords(details.recordId, updatedDetails);
                    }
                  }}
                />
              </FoodLabel>
              <FoodText>회</FoodText>
            </SetContainer>
          </>
        )}
        <DeleteButton onClick={handleModalClick}>삭제</DeleteButton>
      </InputContainer>
      <DeleteModal
        isOpen={modals.deleteModal?.isOpen}
        onClose={handleModalClose}
        onConfirm={handleDeleteModalConfirm}
      /> */}
    </FoodDetailsContainer>
  );
};

export default FoodDetails;

const FoodDetailsContainer = styled.div`
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

const FoodInfo = styled.div`
  display: flex;
  align-items: center;
`;

const CategoryBadge = styled.span`
  background-color: #007bff;
  color: white;
  border-radius: 0.3125rem;
  margin-left: 0.625rem;
  padding: 0.25rem;
  font-size: 0.875rem;
`;

const FoodTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: bold;
  margin-left: 0.625rem;
`;

const FoodLabel = styled.label`
  margin-left: 0.625rem;
  display: block;
  flex-direction: row;
  margin-bottom: 1rem;
  width: 5.625rem;
  gap: 0;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const FoodInput = styled.input`
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

const FoodText = styled.span`
  margin-left: 1.3125rem;
`;

const SetContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DeleteButton = styled.button`
  margin-right: 0.625rem;
  margin-left: 0.625rem;
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
