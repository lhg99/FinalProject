import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useFood } from "../../../../contexts/foodContext";
import { ModalStore } from "../../../../store/store";
// import { deleteRecord } from "../../../../api/Food/foodApi";
import { FoodRecord } from "../../FoodTypes";
import { DeleteModal } from "../../../Board/components/Modal";
import DeleteFoodModal from "../../../../components/Modal/Food/DeleteFoodModal";
import { deleteFoodRecord } from "../../../../api/Food/foodApi";
import { mealTimeLabels } from "../../../../constants/Food/MealTime";

interface FoodDetailProps {
  food: FoodRecord;
}

const FoodDetails: React.FC<FoodDetailProps> = ({ food }) => {
  const [quantity, setQuantity] = useState<string>(food.quantity?.toString() || "");
  const [gram, setGram] = useState<string>(food.gram?.toString() || "");
  const prevDetailsRef = useRef(food);

  const { state: { foodRecords }, updateFoodDetails, removeFood, updateFoodRecords } = useFood();

  const { modals, openModal, closeModal } = ModalStore();

  useEffect(() => {
    const updatedDetails = {
      ...food,
      quantity: quantity ? parseInt(quantity) : 0,
      gram: gram ? parseInt(gram) : 0
    };

    const prevDetails = prevDetailsRef.current;

    const existingRecord = foodRecords.find(
      (record) => record.dietId === food.dietId
    );

    if (JSON.stringify(updatedDetails) !== JSON.stringify(prevDetails)) {
      if (existingRecord) {
        updateFoodRecords(food.dietId, updatedDetails);
        console.log("Food Records Updated:", updatedDetails);
      } else {
        updateFoodDetails(updatedDetails);
        console.log("Food Details Updated:", updatedDetails);
      }
    }
    prevDetailsRef.current = updatedDetails;
  }, [gram, quantity]);

  const handleModalClick = () => {
    openModal("deleteModal");
  };

  const handleModalClose = () => {
    closeModal("deleteModal");
  };

  const handleDeleteModalConfirm = async () => {
    try {
      await deleteFoodRecord(food.dietId);
      removeFood(food.foodRes.foodName);
      closeModal("deleteModal");
    } catch (err) {
      throw err;
    }
  };

  return (
    <FoodDetailsContainer>
      <FoodInfo>
        <CategoryBadge>{mealTimeLabels[food.mealTime as keyof typeof mealTimeLabels] || "기타"}</CategoryBadge>
        <FoodTitle>{food.foodRes.foodName}</FoodTitle>
      </FoodInfo>
      <InputContainer>
        <FoodLabel>
          <FoodInput
            type="number"
            placeholder="총량"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setGram(""); // quantity 입력 시 gram을 비웁니다.
              const newQuantity = parseInt(e.target.value, 10);
              if (!isNaN(newQuantity)) {
                const updatedDetails = { ...food, quantity: newQuantity };
                updateFoodRecords(food.dietId, updatedDetails);
              }
            }}
            disabled={parseInt(gram) > 0} // gram이 0이 아닌 경우 비활성화
          />
          <FoodText> 개</FoodText>
        </FoodLabel>
        <FoodLabel>
          <FoodInput
            type="number"
            placeholder="섭취량"
            value={gram}
            step="10"
            onChange={(e) => {
              setGram(e.target.value);
              setQuantity("");
              const newGram = parseInt(e.target.value, 10);
              if (!isNaN(newGram)) {
                const updatedDetails = { ...food, gram: newGram };
                updateFoodRecords(food.dietId, updatedDetails);
              }
            }}
            disabled={parseInt(quantity) > 0} // quantity가 0이 아닌 경우 비활성화
          />
          <FoodText> g</FoodText>
        </FoodLabel>
        <DeleteButton onClick={handleModalClick}>삭제</DeleteButton>
      </InputContainer>
      <DeleteFoodModal
        isOpen={modals.deleteModal?.isOpen}
        onClose={handleModalClose}
        onConfirm={handleDeleteModalConfirm}
      />
    </FoodDetailsContainer>
  );
};

export default FoodDetails;

const FoodDetailsContainer = styled.div`
  margin-left: 0.9375rem;
  display: flex;
  width: 100%;
  border: 1px solid #afafaf;
  border-radius: 0.1875rem;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  font-size: 0.875rem;
  margin-bottom: 0.9375rem;
`;

const FoodInfo = styled.div`
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
  pointer-events: none;  /* Hover 효과가 적용되지 않도록 설정 */
`;

const FoodTitle = styled.h3`
  font-size: 1.125rem;
  margin-left: 0.625rem;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 0.625rem;
`;

const FoodLabel = styled.label`
  display: flex;
  align-items: center;
  margin-left: 1.25rem;
  margin-bottom: 1rem;
  gap: 0.5rem;  /* Input과 Text 사이의 간격을 조정 */
`;

const FoodInput = styled.input`
  width: 6.25rem;  /* 입력 필드의 너비를 줄임 */
  padding: 0.3125rem;
  border: 1px solid #afafaf;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  margin-left: 0.3125rem;
  margin-top: 20px;

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
  font-size: 0.875rem;
  margin-top: 1.25rem;
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
