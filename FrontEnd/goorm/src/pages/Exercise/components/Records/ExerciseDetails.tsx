import React, { useEffect, useState } from "react";
import { ExerciseData, SetDetails } from "../../../../api/exerciseApi";
import { ExerciseStore } from "../../../../store/store";
import styled from "styled-components";

interface ExerciseDetailProps {
    exercise: ExerciseData;
    isNew: boolean; // 새로운 운동 여부
}

  // 운동 세부정보 입력하는 컴포넌트
const ExerciseDetails: React.FC<ExerciseDetailProps> = ({exercise, isNew}) => {
    const [exerciseName, setExerciseName] = useState<string>(exercise.training_name || "");
    const [distance, setDistance] = useState<string>("");
    const [duration, setDuration] = useState<string>("");
    const [slope, setSlope] = useState<string>("");
    const [pressure, setPressure] = useState<string>("");
    const [sets, setSets] = useState<SetDetails[]>([{ numSets: "", weight: "", count: "" }]);

    const {updateExerciseDetails, removeExercise, categories} = ExerciseStore();

    // 카테고리 이름 가져오기
    const category = categories.find(cat => cat.category_id === exercise.category_id);
    const categoryName = category ? category.category_name : "Unknown";

    useEffect(() => {
        if(exercise.category_id === 1) {
            updateExerciseDetails({ training_name: exercise.training_name, distance, duration, slope, pressure });
        } else {
            updateExerciseDetails({ training_name: exercise.training_name, duration, sets });
        }
    }, [updateExerciseDetails, exercise.category_id, exercise.training_name, distance, duration, slope, pressure, sets ])
    
    const handleDetailChange = (index: number, field: keyof SetDetails, value: string) => {
        const newSets = sets.map((set, i) => (i === index ? { ...set, [field]: value } : set));
        setSets(newSets);
        if (exercise.category_id !== 1) {
            updateExerciseDetails({ training_name: exercise.training_name, duration, sets: newSets });
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
                                updateExerciseDetails({ training_name: e.target.value, duration, sets });
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
                            onChange={(e) => {
                                setDistance(e.target.value);
                                if (exercise.category_id === 1) {
                                    updateExerciseDetails({ training_name: exerciseName, duration, slope, pressure });
                                } else {
                                    updateExerciseDetails({ training_name: exerciseName, duration, sets });
                                }
                            }}
                        />
                    </ExerciseLabel>
                    <ExerciseLabel>
                        <ExerciseInput 
                            type='text' 
                            placeholder=" 시간"
                            value={duration} 
                            onChange={(e) => {
                                setDuration(e.target.value);
                                if (exercise.category_id === 1) {
                                    updateExerciseDetails({ training_name: exerciseName, duration, slope, pressure });
                                } else {
                                    updateExerciseDetails({ training_name: exerciseName, duration, sets });
                                }
                            }}
                        />
                    </ExerciseLabel>
                    <ExerciseLabel> 
                        <ExerciseInput 
                            type='text' 
                            placeholder="경사"
                            value={slope} 
                            onChange={(e) => {
                                setSlope(e.target.value);
                                updateExerciseDetails({ training_name: exerciseName, duration, slope, pressure });
                            }}
                        />
                    </ExerciseLabel>
                    <ExerciseLabel>
                        <ExerciseInput
                            type='text' 
                            placeholder="압력"
                            value={pressure} 
                            onChange={(e) => {
                                setPressure(e.target.value);
                                updateExerciseDetails({ training_name: exerciseName, duration, slope, pressure });
                            }}
                        />
                    </ExerciseLabel>
                </>
            ) : (
                <>
                    {/* <AddButton onClick={addSet}>+</AddButton> */}
                    {sets.map((set, index) => (
                        <SetContainer key={index}>
                            <ExerciseLabel>
                                <ExerciseInput 
                                    type='text' 
                                    placeholder=" 시간"
                                    value={duration} 
                                    onChange={(e) => {
                                        setDuration(e.target.value);
                                        if (exercise.category_id === 1) {
                                            updateExerciseDetails({ training_name: exerciseName, duration, slope, pressure });
                                        } else {
                                            updateExerciseDetails({ training_name: exerciseName, duration, sets });
                                        }
                                    }}
                                />
                            </ExerciseLabel>
                            <ExerciseLabel>
                                <ExerciseInput
                                type="number"
                                placeholder='세트'
                                value={set.numSets}
                                onChange={(e) => handleDetailChange(index, "numSets", e.target.value)}
                                />
                            </ExerciseLabel>
                            <ExerciseLabel>
                                <ExerciseInput
                                    type="number"
                                    placeholder='중량(kg)'
                                    value={set.weight}
                                    step="5"
                                    onChange={(e) => handleDetailChange(index, "weight", e.target.value)}
                                />
                            </ExerciseLabel>
                            <ExerciseLabel>
                                <ExerciseInput
                                    type="number"
                                    placeholder='횟수'
                                    value={set.count}
                                    onChange={(e) => handleDetailChange(index, "count", e.target.value)}
                                />
                            </ExerciseLabel>
                        </SetContainer>
                    ))}
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
    margin-bottom: .625rem;
    margin-left: 0.9375rem;
    padding: .625rem;
    display: flex;
    width: 97%;
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

const SetContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
`;

// const SetDetailsContainer = styled.div`
//     display: flex;
//     flex-direction: row;
//     align-items: flex-start;
//     margin-bottom: 0.5rem;
//     gap: 0.625rem;
// `;

// const AddButton = styled.button`
//     margin-left: 1.5625rem;
//     margin-right: .625rem;
//     margin-top: 0.625rem;
//     height: 50%;
//     background-color: gray;
//     color: white;
//     padding: 0.5rem 1rem;
//     border: none;
//     border-radius: .125rem;
//     cursor: pointer;
//     transition: background-color 0.3s;

//     &:hover {
//         background-color: lightgray;
//     }
// `;

const DeleteButton = styled.button`
    margin-left: 1.5625rem;
    margin-right: .625rem;
    margin-top: 0.625rem;
    height: 50%;
    background-color: #ff4d4d;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: .125rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #ff1a1a;
    }
`;