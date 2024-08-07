import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
// import { FoodRecords } from "../../FoodTypes";
// import DeleteModal from "../Modal/DeleteModal";
// import { deleteRecord } from "../../api/FoodApi";
import { useFood } from "../../../../contexts/foodContext";

interface FoodDetailProps {
    // Food: FoodRecords;
    isAddingFood: boolean; // 새로운 운동 여부
    // details: FoodRecords;
    onFoodNameChange: (name: string) => void;
}

// 운동 세부정보 입력하는 컴포넌트
const FoodDetails: React.FC<FoodDetailProps> = ({ isAddingFood, onFoodNameChange }) => {
    // const [FoodName, setFoodName] = useState<string>(Food.trainingName || "");
    // const [distance, setDistance] = useState<string>(details.distance?.toString() || "");
    // const [duration, setDuration] = useState<string>(details.durationMinutes?.toString() || "0");
    // const [slope, setSlope] = useState<string>(details.incline?.toString() || "0");
    // const [calorie, setCalorie] = useState<string>(details.caloriesBurned?.toString() || "0");
    // const [sets, setSets] = useState<string>(details.sets?.toString() || "0");
    // const [weight, setWeight] = useState<string>(details.weight?.toString() || "0");
    // const [count, setCount] = useState<string>(details.reps?.toString() || "0");
    // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    // const prevDetailsRef = useRef(details);

    // const { updateFoodDetails, removeFood } = useFood();

    // useEffect(() => {
    //     const updatedDetails = {
    //         ...details,
    //         trainingName: FoodName,
    //         distance: distance ? parseFloat(distance) : 0,
    //         durationMinutes: duration ? parseInt(duration) : 0,
    //         incline: slope ? parseFloat(slope) : 0,
    //         caloriesBurned: calorie ? parseInt(calorie) : 0,
    //         sets: sets ? parseInt(sets) : 0,
    //         weight: weight ? parseFloat(weight) : 0,
    //         reps: count ? parseInt(count) : 0,
    //     };
    
    //     const prevDetails = prevDetailsRef.current;
    //     // Check if updatedDetails differ from previous details
    //     if (JSON.stringify(updatedDetails) !== JSON.stringify(prevDetails)) {
    //         updateFoodDetails(updatedDetails);
    //         console.log('Details Updated:', updatedDetails);
    //     }
    //     prevDetailsRef.current = updatedDetails;
    // }, [FoodName, distance, duration, slope, calorie, sets, weight, count, details, updateFoodDetails]);

    // const handleDeleteClick = () => {
    //     setIsModalOpen(true);
    // };

    // const handleModalClose = () => {
    //     setIsModalOpen(false);
    // };

    // const handleModalConfirm = async () => {
    //     try {
    //         await deleteRecord(details.recordId);
    //         removeFood(details.trainingName); // 상태에서 운동 삭제
    //         setIsModalOpen(false); // 모달 닫기
    //     } catch (err) {
    //         throw err;
    //     }
    // };

    return (
        <FoodDetailsContainer>
            {/* <FoodInfo>
                <CategoryBadge>{Food.categoryName}</CategoryBadge>
                <FoodTitle>{Food.trainingName}</FoodTitle>
            </FoodInfo>
            <InputContainer>
                {details.categoryName === "유산소" ? (
                    <>
                        <FoodLabel>
                            <FoodInput
                                type='text'
                                placeholder="거리"
                                value={distance}
                                onChange={(e) => {
                                    setDistance(e.target.value);
                                    updateFoodDetails({...details, distance: parseFloat(e.target.value)});
                                }}
                            />
                        </FoodLabel>
                        <FoodText>km</FoodText>
                        <FoodLabel>
                            <FoodInput
                                type='text'
                                placeholder=" 시간"
                                value={duration}
                                onChange={(e) => {
                                    setDuration(e.target.value);
                                    updateFoodDetails({ ...details, durationMinutes: parseInt(e.target.value) });
                                }}
                            />
                        </FoodLabel>
                        <FoodText>분</FoodText>
                        <FoodLabel>
                            <FoodInput
                                type='text'
                                placeholder="경사"
                                value={slope}
                                onChange={(e) => {
                                    setSlope(e.target.value);
                                    updateFoodDetails({ ...details, incline: parseFloat(e.target.value) });
                                }}
                            />
                        </FoodLabel>
                        <FoodText>도</FoodText>
                        <FoodLabel>
                            <FoodInput
                                type='text'
                                placeholder="칼로리"
                                value={calorie}
                                onChange={(e) => {
                                    setCalorie(e.target.value);
                                    updateFoodDetails({ ...details, caloriesBurned: parseInt(e.target.value) });
                                }}
                            />
                        </FoodLabel>
                        <FoodText>kcal</FoodText>
                    </>
                ) : (
                    <>
                        <SetContainer>
                            <FoodLabel>
                                <FoodInput
                                    type='text'
                                    placeholder=" 시간"
                                    value={duration}
                                    onChange={(e) => {
                                        setDuration(e.target.value);
                                        updateFoodDetails({ ...details, durationMinutes: parseInt(e.target.value) });
                                    }}
                                />
                            </FoodLabel>
                            <FoodText>분</FoodText>
                            <FoodLabel>
                                <FoodInput
                                    type="number"
                                    placeholder='세트'
                                    value={sets}
                                    onChange={(e) => {
                                        setSets(e.target.value);
                                        updateFoodDetails({...details, sets: parseInt(e.target.value)});
                                    }}
                                />
                            </FoodLabel>
                            <FoodText>세트</FoodText>
                            <FoodLabel>
                                <FoodInput
                                    type="number"
                                    placeholder='중량(kg)'
                                    value={weight}
                                    step="5"
                                    onChange={(e) => {
                                        setWeight(e.target.value);
                                        updateFoodDetails({...details, weight: parseFloat(e.target.value)});
                                    }}
                                />
                            </FoodLabel>
                            <FoodText>kg</FoodText>
                            <FoodLabel>
                                <FoodInput
                                    type="number"
                                    placeholder='횟수'
                                    value={count}
                                    onChange={(e) => {
                                        setCount(e.target.value);
                                        updateFoodDetails({...details, reps: parseInt(e.target.value)});
                                    }}
                                />
                            </FoodLabel>
                            <FoodText>회</FoodText>
                        </SetContainer>
                    </>
                )}
                <DeleteButton onClick={handleDeleteClick}>삭제</DeleteButton>
            </InputContainer>
            <DeleteModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onConfirm={handleModalConfirm}
            /> */}
        </FoodDetailsContainer>
    );
}

export default FoodDetails;

const FoodDetailsContainer = styled.div`
    margin-top: .625rem;
    margin-left: 0.9375rem;
    display: flex;
    width: 100%;
    border: 1px solid #AFAFAF;
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
    border: 1px solid #AFAFAF;
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
    margin-right: .625rem;
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
