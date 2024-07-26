import React, { useEffect, useState } from "react";
import { ExerciseData, ExerciseRecords } from "../../api/exerciseApi";
import { ExerciseStore } from "../../../../store/store";
import styled from "styled-components";

interface ExerciseDetailProps {
    exercise: ExerciseRecords;
    isNew: boolean; // 새로운 운동 여부
    details: ExerciseRecords;
}

  // 운동 세부정보 입력하는 컴포넌트
const ExerciseDetails: React.FC<ExerciseDetailProps> = ({exercise, isNew, details}) => {
    const [exerciseName, setExerciseName] = useState<string>(exercise.trainingName || "");
    const [distance, setDistance] = useState<string>(details.distance?.toString() || "");
    const [duration, setDuration] = useState<string>(details.durationMinutes?.toString() || "");
    const [slope, setSlope] = useState<string>(details.incline?.toString() || "");
    const [calorie, setCalorie] = useState<string>(details.caloriesBurned?.toString() || "");
    const [sets, setSets] = useState<string>(details.sets?.toString() || "");
    const [weight, setWeight] = useState<string>(details.weight?.toString() || "");
    const [count, setCount] = useState<string>(details.reps?.toString() || "");

    const {updateExerciseDetails, removeExercise} = ExerciseStore();

    useEffect(() => {
        console.log("ExerciseDetails Props:", { exercise, isNew, details });
    }, [exercise, isNew, details]);

    useEffect(() => {
        const updatedDetails = {
            ...details,
            trainingName: exerciseName,
            distance: distance ? parseFloat(distance) : null,
            durationMinutes: duration ? parseInt(duration) : 0,
            incline: slope ? parseFloat(slope) : null,
            caloriesBurned: calorie ? parseInt(calorie) : 0,
            sets: sets ? parseInt(sets) : null,
            weight: weight ? parseFloat(weight) : null,
            reps: count ? parseInt(count) : null,
        };

        if (JSON.stringify(updatedDetails) !== JSON.stringify(details)) {
            updateExerciseDetails(updatedDetails);
        }
    }, [exerciseName, distance, duration, slope, calorie, sets, weight, count]);

    const handleBlur = (field: string, value: string) => {
        if (field === "distance") {
            setDistance(value);
        } else if (field === "weight") {
            setWeight(value);
        } else if (field === "count") {
            setCount(value);
        } else if (field === "sets") {
            setSets(value);
        }

        updateExerciseDetails({
            ...details,
            [field]: field === "distance" || field === "weight" || field === "slope"
                ? parseFloat(value)
                : parseInt(value)
        });
    };

    return (
    <ExerciseDetailsContainer>
        <ExerciseInfo>
            <CategoryBadge>{exercise.categoryName}</CategoryBadge>
            <ExerciseTitle>{isNew ? "새로운 운동 추가" : exercise.trainingName}</ExerciseTitle>
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
                            if (exercise.categoryName !== "유산소") {
                                updateExerciseDetails({...details, trainingName: e.target.value})
                            }
                        }}
                    />
                </ExerciseLabel>
            )}
            {details.categoryName === "유산소" ? (
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
                                updateExerciseDetails({...details, durationMinutes: parseInt(e.target.value)});
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
                                updateExerciseDetails({...details, incline: parseFloat(e.target.value)});
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
                                updateExerciseDetails({...details, caloriesBurned: parseInt(e.target.value)});
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
                                    updateExerciseDetails({...details, durationMinutes: parseInt(e.target.value)});
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
            <DeleteButton onClick={() => removeExercise(exercise.trainingName)}>삭제</DeleteButton>
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
    border: 1px solid #AFAFAF;
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
    font-size: 0.875rem;
    padding: 0.25rem 0.25rem;
    border-radius: 0.25rem;
    margin-left: 0.625rem;
`;

const ExerciseTitle = styled.h3`
    font-size: 0.875rem;
    margin-left: 0.3125rem;
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
    // gap: 1rem;
`;

const ExerciseInput = styled.input`
    display: flex;
    width: 100%;
    padding: 0.5rem;
    margin-top: 1.25rem;
    border: 1px solid #AFAFAF;
    border-radius: 0.625rem;
    font-size: 0.875rem;

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
    margin-right: 0.9375rem;
    font-size: 0.875rem;
`;

const SetContainer = styled.div`
    display: flex;
    flex-direction: row;
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
    font-size: 0.875rem;

    &:hover {
        background-color: #ff1a1a;
    }
`;