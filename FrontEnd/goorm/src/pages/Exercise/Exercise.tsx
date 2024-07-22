import React, { useCallback, useState } from 'react'
import MyCalendar from './components/Calendar/Calendar';
import ExerciseMemo from './ExerciseMemo';
import ExerciseSearch from './ExerciseSearch';
import ExerciseList from './components/Records/ExerciseList';
import { ExerciseData } from '../../api/exerciseApi';
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

    return(
        <div className='exercise'>
            <div className='exercise-container'>
                <div className='left-column'>
                    <div className='calendar'>
                        <MyCalendar onDateChange={handleDateChange} />
                        <ExerciseCategoryTable exercises={selectedExercises} categories={categories}/>
                    </div>

                    <div className='calendar-right'>
                        {dateInfo && (
                            <div className='date-info'>
                                <p className='date-text'>{`${dateInfo.year}-${dateInfo.month}-${dateInfo.day} ${dateInfo.weekday}`}</p>
                            </div>
                        )}
                        <ExerciseSearch onAddExercise={handleAddExercise} onAddCustomExercise={handleAddCustomExercise}/>
                    </div>
                </div>
                <div className='right-column'>
                    <ExerciseList 
                        exercises={selectedExercises}
                    />
                </div>
            </div>
            <ExerciseMemo onFileUpload={handleFileUpload}/>
        </div>
    );
}

export default Exercise