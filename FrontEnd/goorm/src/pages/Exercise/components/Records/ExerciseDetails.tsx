import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useExercise } from "../../../../contexts/exerciseContext";
import { ExerciseRecords } from "../../ExerciseTypes";
import DeleteModal from "../Modal/DeleteModal";
import { deleteRecord } from "../../api/exerciseApi";
import MemoEditModal from "../Modal/MemoEditModal";

interface ExerciseDetailProps {
    exercise: ExerciseRecords;
    isAddingExercise: boolean; // 새로운 운동 여부
    details: ExerciseRecords;
    onExerciseNameChange: (name: string) => void;
}

// 운동 세부정보 입력하는 컴포넌트
const ExerciseDetails: React.FC<ExerciseDetailProps> = ({ exercise, isAddingExercise, details, onExerciseNameChange }) => {
    const [exerciseName, setExerciseName] = useState<string>(exercise.trainingName || "");
    const [distance, setDistance] = useState<string>(details.distance?.toString() || "");
    const [duration, setDuration] = useState<string>(details.durationMinutes?.toString() || "0");
    const [slope, setSlope] = useState<string>(details.incline?.toString() || "0");
    const [calorie, setCalorie] = useState<string>(details.caloriesBurned?.toString() || "0");
    const [sets, setSets] = useState<string>(details.sets?.toString() || "0");
    const [weight, setWeight] = useState<string>(details.weight?.toString() || "0");
    const [count, setCount] = useState<string>(details.reps?.toString() || "0");
    const prevDetailsRef = useRef(details);

    const { 
        state: {isEditModalOpen, isDeleteModalOpen, selectedRecords },
        updateExerciseDetails, removeExercise, setIsDeleteModalOpen, setIsEditModalOpen, setSelectedRecord } = useExercise();

    useEffect(() => {
        const updatedDetails = {
            ...details,
            trainingName: exerciseName,
            distance: distance ? parseFloat(distance) : 0,
            durationMinutes: duration ? parseInt(duration) : 0,
            incline: slope ? parseFloat(slope) : 0,
            caloriesBurned: calorie ? parseInt(calorie) : 0,
            sets: sets ? parseInt(sets) : 0,
            weight: weight ? parseFloat(weight) : 0,
            reps: count ? parseInt(count) : 0,
        };
    
        const prevDetails = prevDetailsRef.current;
        // Check if updatedDetails differ from previous details
        if (JSON.stringify(updatedDetails) !== JSON.stringify(prevDetails)) {
            updateExerciseDetails(updatedDetails);
            console.log('Details Updated:', updatedDetails);
        }
        prevDetailsRef.current = updatedDetails;
    }, [exerciseName, distance, duration, slope, calorie, sets, weight, count, details, updateExerciseDetails]);

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
    };

    const handleDeleteModalConfirm = async () => {
        try {
            await deleteRecord(details.recordId);
            removeExercise(details.trainingName); // 상태에서 운동 삭제
            setIsDeleteModalOpen(false); // 모달 닫기
        } catch (err) {
            throw err;
        }
    };

    const handleEditClick = () => {
        setSelectedRecord(details.recordId); // 클릭한 레코드의 ID를 설정
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setSelectedRecord(null);
        setIsEditModalOpen(false);
    };

    return (
        <ExerciseDetailsContainer>
            <ExerciseInfo>
                <CategoryBadge>{exercise.categoryName}</CategoryBadge>
                <ExerciseTitle onClick={handleEditClick}>{exercise.trainingName}</ExerciseTitle>
            </ExerciseInfo>
            <InputContainer>
                {details.categoryName === "유산소" ? (
                    <>
                        <ExerciseLabel>
                            <ExerciseInput
                                type='text'
                                placeholder="거리"
                                value={distance}
                                onChange={(e) => {
                                    setDistance(e.target.value);
                                    updateExerciseDetails({...details, distance: parseFloat(e.target.value)});
                                }}
                            />
                        </ExerciseLabel>
                        <ExerciseText>km</ExerciseText>
                        <ExerciseLabel>
                            <ExerciseInput
                                type='text'
                                placeholder=" 시간"
                                value={duration}
                                onChange={(e) => {
                                    setDuration(e.target.value);
                                    updateExerciseDetails({ ...details, durationMinutes: parseInt(e.target.value) });
                                }}
                            />
                        </ExerciseLabel>
                        <ExerciseText>분</ExerciseText>
                        <ExerciseLabel>
                            <ExerciseInput
                                type='text'
                                placeholder="경사"
                                value={slope}
                                onChange={(e) => {
                                    setSlope(e.target.value);
                                    updateExerciseDetails({ ...details, incline: parseFloat(e.target.value) });
                                }}
                            />
                        </ExerciseLabel>
                        <ExerciseText>도</ExerciseText>
                        <ExerciseLabel>
                            <ExerciseInput
                                type='text'
                                placeholder="칼로리"
                                value={calorie}
                                onChange={(e) => {
                                    setCalorie(e.target.value);
                                    updateExerciseDetails({ ...details, caloriesBurned: parseInt(e.target.value) });
                                }}
                            />
                        </ExerciseLabel>
                        <ExerciseText>kcal</ExerciseText>
                    </>
                ) : (
                    <>
                        <SetContainer>
                            <ExerciseLabel>
                                <ExerciseInput
                                    type='text'
                                    placeholder=" 시간"
                                    value={duration}
                                    onChange={(e) => {
                                        setDuration(e.target.value);
                                        updateExerciseDetails({ ...details, durationMinutes: parseInt(e.target.value) });
                                    }}
                                />
                            </ExerciseLabel>
                            <ExerciseText>분</ExerciseText>
                            <ExerciseLabel>
                                <ExerciseInput
                                    type="number"
                                    placeholder='세트'
                                    value={sets}
                                    onChange={(e) => {
                                        setSets(e.target.value);
                                        updateExerciseDetails({...details, sets: parseInt(e.target.value)});
                                    }}
                                />
                            </ExerciseLabel>
                            <ExerciseText>세트</ExerciseText>
                            <ExerciseLabel>
                                <ExerciseInput
                                    type="number"
                                    placeholder='중량(kg)'
                                    value={weight}
                                    step="5"
                                    onChange={(e) => {
                                        setWeight(e.target.value);
                                        updateExerciseDetails({...details, weight: parseFloat(e.target.value)});
                                    }}
                                />
                            </ExerciseLabel>
                            <ExerciseText>kg</ExerciseText>
                            <ExerciseLabel>
                                <ExerciseInput
                                    type="number"
                                    placeholder='횟수'
                                    value={count}
                                    onChange={(e) => {
                                        setCount(e.target.value);
                                        updateExerciseDetails({...details, reps: parseInt(e.target.value)});
                                    }}
                                />
                            </ExerciseLabel>
                            <ExerciseText>회</ExerciseText>
                        </SetContainer>
                    </>
                )}
                <DeleteButton onClick={handleDeleteClick}>삭제</DeleteButton>
            </InputContainer>
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteModalClose}
                onConfirm={handleDeleteModalConfirm}
            />
            <MemoEditModal isOpen={isEditModalOpen} onClose={handleEditModalClose} memoId={details.recordId}/>
        </ExerciseDetailsContainer>
    );
}

export default ExerciseDetails;

const ExerciseDetailsContainer = styled.div`
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

const ExerciseInfo = styled.div`
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

const ExerciseTitle = styled.h3`
    font-size: 1.125rem;
    font-weight: bold;
    margin-left: 0.625rem;
`;

const ExerciseLabel = styled.label`
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

const ExerciseInput = styled.input`
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

const ExerciseText = styled.span`
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
