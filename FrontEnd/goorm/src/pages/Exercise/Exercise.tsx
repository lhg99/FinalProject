import React, { useCallback, useEffect, useState } from 'react';
import MyCalendar from './components/Date/Calendar';
import ExerciseMemo from './ExerciseMemo';
import ExerciseSearch from './ExerciseSearch';
import ExerciseList from './components/Records/ExerciseList';
import {  postCardioRecord, postCustomExerciseData, postStrengthRecord } from './api/exerciseApi';
import styles from './Exercise.module.scss';
import ExerciseCategoryTable from './ExerciseCategoryTable';
import { useExercise } from '../../contexts/exerciseContext';
import { ExerciseData, ExerciseRecords } from './ExerciseTypes';
import DateSelector from './components/Date/DateSelector';
import { useAuth } from '../Login/auth/AuthContext';

const Exercise: React.FC = () => {

    const [dateInfo, setDateInfo] = useState<{ year: number, month: number, day: number, weekday: string } | null>(null);
    const [customExerciseName, setCustomExerciseName] = useState<string>("");
    const { user } = useAuth();
    
    const { 
        state: { selectedExercises, exerciseRecords, exerciseDetails, imageFile, startDate, endDate },
        addSelectedExercises,
        addCustomExercises,
        setStartDate,
        setEndDate
    } = useExercise();

    const handleAddExercise = useCallback((exercise: ExerciseData) => {
        addSelectedExercises(exercise);
    }, [addSelectedExercises]);

    const handleAddCustomExercise = useCallback((exercise: ExerciseData) => {
        addCustomExercises(exercise);
        addSelectedExercises(exercise);
    }, [addCustomExercises, addSelectedExercises]);

    const handleExerciseNameChange = (name: string) => {
        setCustomExerciseName(name);
    };

    const handleDateChange = useCallback((info: { year: number, month: number, day: number, weekday: string }) => {
        setDateInfo(info);
    }, []);

    const handleStartDate = (date: Date) => {
        setStartDate(date);
    }

    const handleEndDate = (date: Date) => {
        setEndDate(date);
    }

    const handleSave = async () => {
        const maxRecordId = Math.max(0, ...exerciseRecords.map(record => record.recordId));
        try {
            const customExercises = selectedExercises.filter(ex => ex.isAddingExercise);
    
            for (const customExercise of customExercises) {
                const customExercisePayload = {
                    name: customExercise.name,
                    category: {
                        categoryId: customExercise.categoryId,
                        categoryName: customExercise.categoryName
                    }
                };
    
                console.log('Payload to send:', customExercisePayload); // Payload 확인
                const newExerciseId: number = await postCustomExerciseData(customExercisePayload);
                customExercise.id = newExerciseId; // 서버로부터 받은 새 ID로 업데이트
            }

            const combinedRecords: ExerciseRecords[] = selectedExercises.map((exercise) => {
                const details = exerciseDetails[exercise.name] || {};
                return {
                    recordId: maxRecordId + 1,
                    trainingName: exercise.name,
                    exerciseDate: new Date().toISOString(),
                    sets: details.sets || 0,
                    weight: details.weight || 0,
                    distance: details.distance,
                    durationMinutes: details.durationMinutes || 0,
                    caloriesBurned: details.caloriesBurned || 0,
                    incline: details.incline || 0,
                    reps: details.reps || 0,
                    satisfaction: details.satisfaction || 0,
                    intensity: details.intensity || "",
                    memo: details.memo || "",
                    categoryName: exercise.categoryName,
                    trainingId: exercise.id
                };
            });

            for (const record of combinedRecords) {
                if (record.categoryName === "유산소") {
                    await postCardioRecord(record.trainingId, record);
                } else {
                    await postStrengthRecord(record.trainingId, record);
                }
            }
        } catch (err) {
            console.error("운동기록 저장 실패", err);
        }
    };

    return (
        <div className={styles.exercise}>
            <div className={styles.exerciseContainer}>
                <div className={styles.leftColumn}>
                    <div className='calendar'>
                        <MyCalendar onDateChange={handleDateChange} />
                        <p>{user?.memberId}</p>
                        <DateSelector 
                            startDate={startDate} 
                            endDate={endDate} 
                            onHandleStartDate={handleStartDate} 
                            onHandleEndDate={handleEndDate}
                        ></DateSelector>
                        <ExerciseCategoryTable />
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
            <ExerciseMemo />
            <button className={styles.saveButton} onClick={handleSave}>저장하기</button>
        </div>
    );
};

export default Exercise;
