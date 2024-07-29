import React, { useCallback, useState } from 'react'
import MyCalendar from './components/Calendar/Calendar';
import ExerciseMemo from './ExerciseMemo';
import ExerciseSearch from './ExerciseSearch';
import ExerciseList from './components/Records/ExerciseList';
import { ExerciseData, ExerciseRecords, postCardioRecord, postStrengthRecord } from './api/exerciseApi';
import './Exercise.scss';
import { ExerciseStore } from '../../store/store';
import ExerciseCategoryTable from './ExerciseCategoryTable';

const Exercise: React.FC = () => {

    const [dateInfo, setDateInfo] = useState<{ year: number, month: number, day: number, weekday: string } | null>(null);
    
    const { categories, selectedExercises, addSelectedExercises, addCustomExercises, exerciseRecords, exerciseDetails, imageFile } = ExerciseStore();

    const handleAddExercise = useCallback((exercise: ExerciseData) => {
        addSelectedExercises(exercise);
    }, [addSelectedExercises]);

    const handleAddCustomExercise = useCallback((exercise: ExerciseData) => {
        addCustomExercises(exercise);
        addSelectedExercises(exercise)
    }, [addCustomExercises, addSelectedExercises])

    const handleDateChange = useCallback((info: { year: number, month: number, day: number, weekday: string }) => {
        setDateInfo(info);
    }, []);

    const handleFileUpload = (file: File) => {
        console.log('업로드 파일', file);
    }

    const handleSave = async() => {
        const maxRecordId = Math.max(0, ...exerciseRecords.map(record => record.recordId));
        try {
            const combinedRecords: ExerciseRecords[] = selectedExercises.map((exercise, index) => {
                const details = exerciseDetails[exercise.name] || {};
                return {
                    recordId: maxRecordId + index + 1,
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
            console.log("post response 정보 ", combinedRecords)
            for (const record of combinedRecords) {
                if(record.categoryName === "유산소") {
                    await postCardioRecord(record.trainingId, record, imageFile);
                } else {
                    await postStrengthRecord(record.trainingId, record, imageFile);
                }
            }
            console.log("운동기록 저장 성공");
        } catch(err) {
            console.error("운동기록 저장 실패", err);
        }
    }

    console.log('Selected Exercises:', selectedExercises); // selectedExercises가 제대로 설정되었는지 확인

    return(
        <div className='exercise'>
            <div className='exercise-container'>
                <div className='left-column'>
                    <div className='calendar'>
                        <MyCalendar onDateChange={handleDateChange} />
                        <ExerciseCategoryTable exercises={selectedExercises} categories={categories}/>
                    </div>
                </div>
                <div className='right-column'>
                    {dateInfo && (
                        <div className='date-info'>
                            <p className='date-text'>{`${dateInfo.year}년 ${dateInfo.month}월 ${dateInfo.day}일 ${dateInfo.weekday}`}</p>
                        </div>
                    )}
                    <div className='search-list-container'>
                        <div className='search-column'>
                            <ExerciseSearch onAddExercise={handleAddExercise} onAddCustomExercise={handleAddCustomExercise}/>
                        </div>
                        <div className='list-column'>
                            <ExerciseList dateInfo={dateInfo} exercises={selectedExercises} />
                        </div>
                    </div>
                </div>
            </div>
            <ExerciseMemo onFileUpload={handleFileUpload}/>
            <button onClick={handleSave}>저장하기</button>
        </div>
    );
}

export default Exercise;