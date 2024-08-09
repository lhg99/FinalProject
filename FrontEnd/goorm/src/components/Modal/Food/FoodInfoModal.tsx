import React from 'react'
import styled from 'styled-components';
import { useFood } from '../../../contexts/foodContext';

interface FoodInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FoodInfoModal = ({ isOpen, onClose }: FoodInfoModalProps) => {
    const { state: { selectedFood, selectedFoodRecords } } = useFood();

    if(!isOpen) return null;

    return (
        <ModalOverlay>
            <ModalContainer>
                <ModalHeader>
                    <h2>음식 상세정보</h2>
                </ModalHeader>
                <ModalBody>
                    {selectedFoodRecords.length > 0 ? (
                        selectedFoodRecords.map((food) => (
                            <FoodInfo key={food.dietId}>
                                <FoodTitle>{food.foodRes.foodName}</FoodTitle>
                                <p>칼로리: {food.totalCalories} kcal</p>
                                <p>탄수화물: {food.foodRes.carbohydrate} g</p>
                                <p>단백질: {food.foodRes.protein} g</p>
                                <p>지방: {food.foodRes.fat} g</p>
                                <p>당: {food.foodRes.sugar} g</p>
                                <p>나트륨: {food.foodRes.salt} mg</p>
                                <p>콜레스테롤: {food.foodRes.cholesterol} mg</p>
                                <p>포화지방: {food.foodRes.saturatedFat} g</p>
                                <p>트랜스지방: {food.foodRes.transFat} g</p>
                            </FoodInfo>
                        ))
                    ) : (
                        <p>추가된 음식이 없습니다.</p>
                    )}
                </ModalBody>
                <ModalFooter>
                    <CancelButton onClick={onClose}>닫기</CancelButton>
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    )
}

export default FoodInfoModal;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ModalContainer = styled.div`
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    width: 400px;
    max-width: 100%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
`;

const ModalBody = styled.div`
    margin-bottom: 1rem;
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.625rem;
`;

const CancelButton = styled.button`
    background-color: #212121;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    margin-right: 0.5rem;

    &:hover {
        background: #bbb;
    }
`;

const FoodTitle = styled.span`
    font-size: 1.25rem;
    margin-bottom: 0.9375rem;
`

const ConfirmButton = styled.button`
    background: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;

    &:hover {
        background: #0056b3;
    }
`;

const FoodInfo = styled.div`
    margin-bottom: 1rem;

    h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: bold;
    }

    p {
        margin: 0.25rem 0;
        font-size: 0.875rem;
    }
`;

// selectedFood.map((food) => (
//     <FoodInfo key={food.foodId}> {/* food.foodId 사용 */}
//     <h3>{food.foodName}</h3> {/* food.foodName 사용 */}
//     <p>칼로리: {food.calories} kcal</p>
//     <p>탄수화물: {food.carbohydrate} g</p>
//     <p>단백질: {food.protein} g</p>
//     <p>지방: {food.fat} g</p>
//     <p>당: {food.sugar} g</p>
//     <p>나트륨: {food.salt} mg</p>
//     <p>콜레스테롤: {food.cholesterol} mg</p>
//     <p>포화지방: {food.saturatedFat} g</p>
//     <p>트랜스지방: {food.transFat} g</p>
// </FoodInfo>
