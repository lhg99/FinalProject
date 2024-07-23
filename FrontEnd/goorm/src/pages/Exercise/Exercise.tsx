import React, { useCallback, useState } from 'react'
import MyCalendar from './components/Calendar/Calendar';
import ExerciseMemo from './ExerciseMemo';
import ExerciseSearch from './ExerciseSearch';
import ExerciseList from './components/Records/ExerciseList';
import { ExerciseData, postExerciseRecord } from '../../api/exerciseApi';
import './Exercise.scss';
import { ExerciseStore } from '../../store/store';
import ExerciseCategoryTable from './ExerciseCategoryTable';

const Exercise: React.FC = () => {

    const [dateInfo, setDateInfo] = useState<{ year: number, month: number, day: number, weekday: string } | null>(null);
    
    const { categories, selectedExercises, addExercise, addCustomExercises } = ExerciseStore();

    const handleAddExercise = useCallback((exercise: ExerciseData) => {
        addExercise(exercise);
    }, [addExercise]);

    const handleAddCustomExercise = useCallback((exercise: ExerciseData) => {
        addCustomExercises(exercise);
    }, [addCustomExercises])

    const handleDateChange = useCallback((info: { year: number, month: number, day: number, weekday: string }) => {
        setDateInfo(info);
    }, []);

    const handleFileUpload = (file: File) => {
        console.log('업로드 파일', file);
    }

    const handleSave = async() => {
        try {
            await postExerciseRecord();
            console.log("운동기록 저장 성공");
        } catch(err) {
            console.error("운동기록 저장 실패", err);
        }
    }

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

export default Exercise