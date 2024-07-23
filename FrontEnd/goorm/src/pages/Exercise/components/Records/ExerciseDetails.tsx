import React, { useEffect, useState } from "react";
import { ExerciseData, ExerciseDetailInfo } from "../../../../api/exerciseApi";
import { ExerciseStore } from "../../../../store/store";
import styled from "styled-components";

interface ExerciseDetailProps {
    exercise: ExerciseData;
    isNew: boolean; // 새로운 운동 여부
    details: ExerciseDetailInfo;
}

// 문자열을 Float32Array로 변환하는 함수
const stringToFloat32Array = (input: string): Float32Array => {
    const floatArray = input.split(',').map(str => parseFloat(str.trim()));
    return new Float32Array(floatArray);
};

  // 운동 세부정보 입력하는 컴포넌트
const ExerciseDetails: React.FC<ExerciseDetailProps> = ({exercise, isNew, details}) => {
    const [exerciseName, setExerciseName] = useState<string>(exercise.training_name || "");
    const [distance, setDistance] = useState<string>(details.distance?.toString() || "");
    const [duration, setDuration] = useState<string>(details.duration || "");
    const [slope, setSlope] = useState<string>(details.slope || "");
    const [calorie, setCalorie] = useState<string>(details.calorie || "");
    const [sets, setSets] = useState<string>(details.sets?.toString() || "");
    const [weight, setWeight] = useState<string>(details.weight?.toString() || "");
    const [count, setCount] = useState<string>(details.count?.toString() || "");

    const {updateExerciseDetails, removeExercise, categories} = ExerciseStore();

    // 카테고리 이름 가져오기
    const category = categories.find(cat => cat.category_id === exercise.category_id);
    const categoryName = category ? category.category_name : "Unknown";

    useEffect(() => {
        if(exercise.category_id === 1) {
            updateExerciseDetails({ 
                training_name: exercise.training_name, 
                distance: stringToFloat32Array(distance), 
                duration, 
                slope, 
                calorie });
        } else {
            updateExerciseDetails({ 
                training_name: exercise.training_name, 
                duration,
                sets: sets ? parseInt(sets) : undefined,
                weight: stringToFloat32Array(weight), 
                count: count ? parseInt(count) : undefined
            });
        }
    }, [updateExerciseDetails, exercise.category_id, exercise.training_name, distance, duration, slope, calorie, sets, weight, count])

    const handleBlur = (field: string, value: string) => {
        if (field === "distance") {
            setDistance(value);
            updateExerciseDetails({ training_name: exercise.training_name, distance: stringToFloat32Array(value), duration, slope, calorie });
        } else if (field === "weight") {
            setWeight(value);
            updateExerciseDetails({ training_name: exercise.training_name, duration, sets: sets ? parseInt(sets) : undefined, weight: stringToFloat32Array(value), count: count ? parseInt(count) : undefined });
        } else if (field === "count") {
            setCount(value);
            updateExerciseDetails({ training_name: exercise.training_name, duration, sets: sets ? parseInt(sets) : undefined, weight: stringToFloat32Array(weight), count: count ? parseInt(count) : undefined });
        } else if (field === "sets") {
            setSets(value);
            updateExerciseDetails({ training_name: exercise.training_name, duration, sets: value ? parseInt(value) : undefined, weight: stringToFloat32Array(weight), count: count ? parseInt(count) : undefined });
        }
    };

    return (
    <ExerciseDetailsContainer>
        <ExerciseInfo>
            <CategoryBadge>{categoryName}</CategoryBadge>
            <ExerciseTitle>{isNew ? "새로운 운동 추가" : exercise.training_name}</ExerciseTitle>
        </ExerciseInfo>
        <InputContainer>
            {isNew && (
                <ExerciseLabel>
                    <ExerciseInput 
                        type="text" 
                        placeholder="운동 이름 입력"
                        value={exerciseName} 
                        onChange={(e) => {
                            setExerciseName(e.target.value);
                            if (exercise.category_id !== 1) {
                                updateExerciseDetails({ training_name: e.target.value, duration, sets: sets ? parseInt(sets) : undefined, weight: stringToFloat32Array(weight), count: count ? parseInt(count) : undefined });
                            }
                        }}
                    />
                </ExerciseLabel>
            )}
            {exercise.category_id === 1 ? (
                <>
                    <ExerciseLabel>
                        <ExerciseInput 
                            type='text' 
                            placeholder="거리"
                            value={distance} 
                            onBlur={(e) => handleBlur("distance", e.target.value)}
                            onChange={(e) => setDistance(e.target.value)}
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
                                updateExerciseDetails({ training_name: exerciseName, distance: stringToFloat32Array(distance), duration: e.target.value, slope, calorie });
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
                                updateExerciseDetails({ training_name: exerciseName, distance: stringToFloat32Array(distance), duration, slope: e.target.value, calorie });
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
                                updateExerciseDetails({ training_name: exerciseName, duration, slope, calorie });
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
                                    updateExerciseDetails({ training_name: exerciseName, distance: stringToFloat32Array(distance), duration: e.target.value, slope, calorie });
                                }}
                                />
                        </ExerciseLabel>
                        <ExerciseText>분</ExerciseText>
                        <ExerciseLabel>
                            <ExerciseInput
                                type="number"
                                placeholder='세트'
                                value={sets}
                                onBlur={(e) => handleBlur("sets", e.target.value)}
                                onChange={(e) => setSets(e.target.value)}
                            />
                        </ExerciseLabel>
                        <ExerciseText>세트</ExerciseText>
                        <ExerciseLabel>
                            <ExerciseInput
                                type="number"
                                placeholder='중량(kg)'
                                value={weight}
                                step="5"
                                onBlur={(e) => handleBlur("weight", e.target.value)}
                                onChange={(e) => setWeight(e.target.value)}
                            />
                        </ExerciseLabel>
                        <ExerciseText>kg</ExerciseText>
                        <ExerciseLabel>
                            <ExerciseInput
                                type="number"
                                placeholder='횟수'
                                value={count}
                                onBlur={(e) => handleBlur("count", e.target.value)}
                                onChange={(e) => setCount(e.target.value)}
                            />
                        </ExerciseLabel>
                        <ExerciseText>회</ExerciseText>
                    </SetContainer>
                </>
            )}
            <DeleteButton onClick={() => removeExercise(exercise.training_name)}>삭제</DeleteButton>
        </InputContainer>
    </ExerciseDetailsContainer>
    )
}

export default ExerciseDetails;

const ExerciseDetailsContainer = styled.div`
    margin-top: .625rem;
    margin-left: 0.9375rem;
    display: flex;
    width: 98%;
    border: 1px solid black;
    border-radius: 0.9375rem;
    justify-content: space-between;
    align-items: center;
`;

const ExerciseInfo = styled.div`
    display: flex;
    align-items: center;
`;

const CategoryBadge = styled.span`
    background-color: #007bff;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    margin-left: 0.625rem;
    margin-right: 0.625rem;
`;

const ExerciseTitle = styled.h3`
    font-size: 1.5rem;
    margin-left: .625rem;
`;

const ExerciseLabel = styled.label`
    margin-left: 1.5625rem;
    display: block;
    flex-direction: row;
    margin-bottom: 1rem;
    align-items: center;
`;

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const ExerciseInput = styled.input`
    display: flex;
    width: 100%;
    padding: 0.5rem;
    margin-top: 1.25rem;
    border: 1px solid black;
    border-radius: 0.625rem;

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
    margin-left: 0.3125rem;
    font-size: 1.25;
`;

const SetContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
`;

const DeleteButton = styled.button`
    margin-right: .625rem;
    margin-left: 0.625rem;
    height: 50%;
    background-color: #ff4d4d;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #ff1a1a;
    }
`;