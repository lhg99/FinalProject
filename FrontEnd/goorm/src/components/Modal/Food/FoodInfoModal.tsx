import React from 'react'
import styled from 'styled-components';
import { useFood } from '../../../contexts/foodContext';
import { mealTimeLabels } from '../../../constants/Food/MealTime';

interface FoodInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FoodInfoModal = ({ isOpen, onClose }: FoodInfoModalProps) => {
    const { state: { selectedFoodRecords } } = useFood();

    const groupedFoodRecords = React.useMemo(() => {
        const groups: { [key in keyof typeof mealTimeLabels]?: typeof selectedFoodRecords } = {};
    
        selectedFoodRecords.forEach(food => {
            const mealTime = food.mealTime as keyof typeof mealTimeLabels;
    
            if (!groups[mealTime]) {
                groups[mealTime] = [];
            }
    
            groups[mealTime]!.push(food);
        });
    
        return groups;
    }, [selectedFoodRecords]);

    if(!isOpen) return null;

    return (
        <ModalOverlay>
            <ModalContainer>
                <ModalHeader>
                    <h2>음식 상세정보</h2>
                </ModalHeader>
                <ModalBody>
                {Object.entries(groupedFoodRecords).map(([mealTime, foods]) => (
                        foods?.length > 0 && (
                            <div key={mealTime}>
                                <MealTimeHeader>{mealTimeLabels[mealTime as keyof typeof mealTimeLabels]}</MealTimeHeader>
                                {foods.map((food) => (
                                    <FoodInfo key={food.dietId}>
                                        <FoodTitle>{food.foodRes.foodName}</FoodTitle>
                                        <FoodDetail>
                                            <p>칼로리: {food.totalCalories} kcal</p>
                                            <p>탄수화물: {food.foodRes.carbohydrate} g</p>
                                            <p>단백질: {food.foodRes.protein} g</p>
                                            <p>지방: {food.foodRes.fat} g</p>
                                            <p>당: {food.foodRes.sugar > 0 ? food.foodRes.sugar : 0} g</p>
                                            <p>나트륨: {food.foodRes.salt > 0 ? food.foodRes.salt : 0} mg</p>
                                            <p>콜레스테롤: {food.foodRes.cholesterol > 0 ? food.foodRes.cholesterol : 0} mg</p>
                                            <p>포화지방: {food.foodRes.saturatedFat > 0 ? food.foodRes.saturatedFat : 0} g</p>
                                            <p>트랜스지방: {food.foodRes.transFat > 0 ? food.foodRes.transFat : 0} g</p>
                                        </FoodDetail>
                                    </FoodInfo>
                                ))}
                            </div>
                        )
                    ))}
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
    width: 25rem;
    max-width: 25rem;
    max-height: 51.25rem;
    overflow-y: auto;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ModalBody = styled.div`
    margin-bottom: 0.625rem;
`;

const MealTimeHeader = styled.h3`
    margin-top: 1.5rem;
    font-size: 1.25rem;
    font-weight: bold;
    color: #333;
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
`

const FoodInfo = styled.div`
    margin-bottom: 1rem;
    border: 1px solid black;
    padding: 5px 5px;
    border-radius: 5px;

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

const FoodDetail = styled.div`
    margin-top: 0.625rem;

    p {
        margin-bottom: 10px;
    }
`