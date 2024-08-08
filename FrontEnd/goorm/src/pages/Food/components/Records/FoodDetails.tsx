import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useFood } from "../../../../contexts/foodContext";
import { ModalStore } from "../../../../store/store";
import { deleteRecord } from "../../../../api/Food/foodApi";
import { FoodRecord } from "../../FoodTypes";
import { DeleteModal } from "../../../Board/components/Modal";

interface FoodDetailProps {
  food: FoodRecord;
}

const FoodDetails: React.FC<FoodDetailProps> = ({ food }) => {
  const [quantity, setQuantity] = useState<string>(food.quantity?.toString() || "");
  const [gram, setGram] = useState<string>(food.gram?.toString() || "");
  const prevDetailsRef = useRef(food);

  const {
    state: { foodRecords },
    updateFoodDetails,
    // removeFood,
    // setSelectedRecord,
    updateFoodRecords
  } = useFood();

  const { modals, openModal, closeModal } = ModalStore();

  useEffect(() => {
    const updatedDetails = {
      ...food,
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
  }, [food, foodRecords, updateFoodDetails, updateFoodRecords]);

  const handleModalClick = () => {
    openModal("deleteModal");
  };

  const handleModalClose = () => {
    closeModal("deleteModal");
  };

  const handleDeleteModalConfirm = async () => {
    try {
      await deleteRecord(food.dietId);
      // removeFood(food.foodRes.foodName);
      closeModal("deleteModal");
    } catch (err) {
      throw err;
    }
  };

  return (
    <FoodDetailsContainer>
      <FoodInfo>
        <CategoryBadge>{food.mealType}</CategoryBadge>
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
              const newQuantity = parseInt(e.target.value, 10);
              if (!isNaN(newQuantity)) {
                const updatedDetails = { ...food, quantity: newQuantity };
                updateFoodRecords(food.dietId, updatedDetails);
              }
            }}
          />
          <FoodText> 개</FoodText>
        </FoodLabel>
        <FoodLabel>
          <FoodInput
            type="number"
            placeholder="gram"
            value={gram}
            onChange={(e) => {
              setGram(e.target.value);
              const newGram = parseInt(e.target.value, 10);
              if (!isNaN(newGram)) {
                const updatedDetails = { ...food, gram: newGram };
                updateFoodRecords(food.dietId, updatedDetails);
              }
            }}
          />
          <FoodText> g</FoodText>
        </FoodLabel>
        <DeleteButton onClick={handleModalClick}>삭제</DeleteButton>
      </InputContainer>
      {/* <DeleteModal
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
  gap: 0.625rem;
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
