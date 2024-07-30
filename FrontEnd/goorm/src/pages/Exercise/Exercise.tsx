import React, { useCallback, useEffect, useState } from 'react';
import MyCalendar from './components/Calendar/Calendar';
import ExerciseMemo from './ExerciseMemo';
import ExerciseSearch from './ExerciseSearch';
import ExerciseList from './components/Records/ExerciseList';
import {  postCardioRecord, postCustomExerciseData, postStrengthRecord } from './api/exerciseApi';
import styles from './Exercise.module.scss';
import ExerciseCategoryTable from './ExerciseCategoryTable';
import { useExercise } from '../../contexts/exerciseContext';
import { ExerciseData, ExerciseRecords } from './ExerciseTypes';

const Exercise: React.FC = () => {

    const [dateInfo, setDateInfo] = useState<{ year: number, month: number, day: number, weekday: string } | null>(null);
    const [customExerciseName, setCustomExerciseName] = useState<string>("");
    
    const { 
        state: { categories, selectedExercises, exerciseRecords, exerciseDetails, imageFile },
        addSelectedExercises,
        addCustomExercises
    } = useExercise();

    const handleAddExercise = useCallback((exercise: ExerciseData) => {
        addSelectedExercises(exercise);
    }, [addSelectedExercises]);

    const handleAddCustomExercise = useCallback((exercise: ExerciseData) => {
        console.log('Handling Add Custom Exercise:', exercise); // 디버깅용 로그 추가
        addCustomExercises(exercise);
        addSelectedExercises(exercise);
        console.log('Custom Exercise Added:', exercise);
        console.log('Exercise Name:', exercise.name); // Exercise name 확인
    }, [addCustomExercises, addSelectedExercises]);

    const handleExerciseNameChange = (name: string) => {
        setCustomExerciseName(name);
    };

    const handleDateChange = useCallback((info: { year: number, month: number, day: number, weekday: string }) => {
        setDateInfo(info);
    }, []);

    const handleFileUpload = (file: File) => {
        console.log('업로드 파일', file);
    };

    const handleSave = async () => {
        const maxRecordId = Math.max(0, ...exerciseRecords.map(record => record.recordId));
        try {
            const customExercises = selectedExercises.filter(ex => ex.isAddingExercise);
            console.log("customExercise :", customExercises);
    
            for (const customExercise of customExercises) {
                const customExercisePayload = {
                    trainingName: customExercise.name,
                    category: {
                        categoryId: customExercise.categoryId,
                        categoryName: customExercise.categoryName
                    }
                };
    
                console.log('Payload to send:', customExercisePayload); // Payload 확인
                const newExerciseId: number = await postCustomExerciseData(customExercisePayload);
                customExercise.id = newExerciseId; // 서버로부터 받은 새 ID로 업데이트
                console.log("exerciseName: ", customExercise.name);
            }

            const combinedRecords: ExerciseRecords[] = selectedExercises.map((exercise) => {
                const details = exerciseDetails[exercise.name] || {};
                return {
                    recordId: maxRecordId + 1,
                    trainingName: exercise.name,
                    exerciseDate: new Date().toISOString(),
                    sets: details.sets || null,
                    weight: details.weight || null,
                    distance: details.distance || null,
                    durationMinutes: details.durationMinutes || 0,
                    caloriesBurned: details.caloriesBurned || null,
                    incline: details.incline || null,
                    reps: details.reps || null,
                    satisfaction: details.satisfaction || 0,
                    intensity: details.intensity || "",
                    memo: details.memo || "",
                    categoryName: exercise.categoryName,
                    trainingId: exercise.id
                };
            });

            for (const record of combinedRecords) {
                if (record.categoryName === "유산소") {
                    await postCardioRecord(record.trainingId, record, imageFile);
                } else {
                    await postStrengthRecord(record.trainingId, record, imageFile);
                }
            }
        } catch (err) {
            console.error("운동기록 저장 실패", err);
        }
    };

    useEffect(() => {
        console.log('Selected Exercises:', selectedExercises); // selectedExercises가 제대로 설정되었는지 확인
    }, [selectedExercises]);

    return (
        <div className={styles.exercise}>
            <div className={styles.exerciseContainer}>
                <div className={styles.leftColumn}>
                    <div className='calendar'>
                        <MyCalendar onDateChange={handleDateChange} />
                        {dateInfo && (
                            <p>{`${dateInfo.month}월 운동`}</p>
                        )}
                        <ExerciseCategoryTable exercises={selectedExercises} categories={categories} />
                    </div>
                </div>
                <div className={styles.rightColumn}>
                    {dateInfo && (
                        <div className={styles.dateInfo}>
                            <p className={styles.dateText}>{`${dateInfo.year}년 ${dateInfo.month}월 ${dateInfo.day}일 ${dateInfo.weekday}`}</p>
                        </div>
                    )}
                    <div className={styles.searchListContainer}>
                        <div className={styles.searchColumn}>
                            <ExerciseSearch onAddExercise={handleAddExercise} onAddCustomExercise={handleAddCustomExercise} />
                            <ExerciseList dateInfo={dateInfo} exercises={selectedExercises} onExerciseNameChange={handleExerciseNameChange} />
                        </div>
                    </div>
                </div>
            </div>
            <ExerciseMemo onFileUpload={handleFileUpload} />
            <button className={styles.saveButton} onClick={handleSave}>저장하기</button>
        </div>
    );
};

export default Exercise;
