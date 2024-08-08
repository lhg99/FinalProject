/**
 * 운동 페이지 총괄하는 컴포넌트
 * MyCalendar: 캘린더 컴포넌트
 * DateSelector: 시작 날짜, 종료 날짜 정하는 컴포넌트
 * ExerciseCategoryTable: DateSelector에서 고른 날짜 기준으로 
 *  카테고리별 운동 비율을 알려주는 컴포넌트
 * ExerciseSearch: 운동 검색하는 컴포넌트
 * ExerciseList: 오늘의 운동목록을 보여주는 컴포넌트(
 *  ExerciseDetails: 유산소, 근력 운동 세부 사항
 *    (분, 세트, 횟수 등)을 입력할 수 있는 컴포넌트
 * )
 * ExerciseMemo: CKEditor를 이용한 텍스트, 사진 넣을 수 있는 컴포넌트
 */

import React, { useCallback, useState } from "react";
import MyCalendar from "./components/Date/Calendar";
import ExerciseMemo from "./ExerciseMemo";
import ExerciseSearch from "./ExerciseSearch";
import ExerciseList from "./components/Records/ExerciseList";
import styles from "./Exercise.module.scss";
import ExerciseCategoryTable from "./ExerciseCategoryTable";
import { useExercise } from "../../contexts/exerciseContext";
import { ExerciseData, ExerciseRecords } from "./ExerciseTypes";
import DateSelector from "./components/Date/DateSelector";
import { useAuth } from "../Login/auth/AuthContext";
import {
  EditExerciseRecord,
  postCardioRecord,
  postCustomExerciseData,
  postExerciseMemo,
  postStrengthRecord,
} from "../../api/Exercise/exerciseApi";
import { formatDateInfo } from "../../utils/DateUtils";

const Exercise: React.FC = () => {
  const [dateInfo, setDateInfo] = useState<{ year: number; month: number; day: number; weekday: string; formattedDate: string } | null>(null);
  const [customExerciseName, setCustomExerciseName] = useState<string>("");
  const { user } = useAuth();

  const {
    state: {
      selectedExercises,
      exerciseRecords,
      exerciseDetails,
      startDate,
      endDate,
      memo,
      selectedExerciseRecords
    },
    addSelectedExercises,
    addCustomExercises,
    setStartDate,
    setEndDate,
  } = useExercise();

  const handleAddExercise = useCallback(
    (exercise: ExerciseData) => {
      addSelectedExercises(exercise);
    },
    [addSelectedExercises]
  );

  const handleAddCustomExercise = useCallback(
    (exercise: ExerciseData) => {
      addCustomExercises(exercise);
      addSelectedExercises(exercise);
    },
    [addCustomExercises, addSelectedExercises]
  );

  const handleExerciseNameChange = (name: string) => {
    setCustomExerciseName(name);
  };

  const handleDateChange = useCallback(
    (info: { year: number; month: number; day: number; weekday: string }) => {
      const formattedDate = formatDateInfo(info); // Format the date as a string
      setDateInfo({ ...info, formattedDate }); // Store both the original info and formatted date
    },[]
  );

  const handleStartDate = (date: Date) => {
    setStartDate(date);
  };

  const handleEndDate = (date: Date) => {
    setEndDate(date);
  };

  const handleSave = async () => {
    try {
      const customExercises = selectedExercises.filter(
        (ex) => ex.isAddingExercise
      );
  
      for (const customExercise of customExercises) {
        const customExercisePayload = {
          name: customExercise.name,
          category: {
            categoryId: customExercise.categoryId,
            categoryName: customExercise.categoryName,
          },
        };
  
        console.log("Payload to send:", customExercisePayload); // Payload 확인
        const newExerciseId: number = await postCustomExerciseData(
          customExercisePayload
        );
        customExercise.id = newExerciseId; // 서버로부터 받은 새 ID로 업데이트
      }
  
      // selectedExercises에서 각 운동을 확인하여 기록 생성 또는 업데이트
      for (const exercise of selectedExercises) {
        const details = exerciseDetails[exercise.name] || {};
        const existingRecord = exerciseRecords.find(
          (record) => record.trainingId === exercise.id
        );
  
        const recordData: ExerciseRecords = {
          recordId: existingRecord ? existingRecord.recordId : new Date().getTime(), // Use existing ID or generate new
          trainingName: exercise.name,
          exerciseDate: dateInfo ? dateInfo.formattedDate : "",
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
          trainingId: exercise.id,
        };
  
        // 운동 종류에 따라 postCardioRecord 또는 postStrengthRecord로 기록을 생성
        if (!existingRecord) {
          if (recordData.categoryName === "유산소") {
            await postCardioRecord(recordData.trainingId, recordData);
          } else {
            await postStrengthRecord(recordData.trainingId, recordData);
          }
          console.log("Created record:", recordData);
        }
      }
  
      // 운동 메모 저장
      await postExerciseMemo(memo.content);
      alert("운동 기록이 저장되었습니다.");
    } catch (err) {
      console.error("운동기록 저장 실패", err);
    }
  };

  const handleEdit = async () => {
    try {
      // Loop through exerciseRecords to send each record for editing
      await EditExerciseRecord(selectedExerciseRecords, memo);
      // await postExerciseMemo(memo.content);
      alert("운동 기록이 수정되었습니다.");
    } catch (err) {
      console.error("운동기록 수정 실패", err);
    }
  };

  return (
    <div className={styles.exercise}>
      <div className={styles.exerciseContainer}>
        <div className={styles.leftColumn}>
          <div className="calendar">
            <MyCalendar onDateChange={handleDateChange} />
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
              <p
                className={styles.dateText}
              >{`${dateInfo.year}년 ${dateInfo.month}월 ${dateInfo.day}일 ${dateInfo.weekday}`}</p>
            </div>
          )}
          <div className={styles.searchListContainer}>
            <div className={styles.searchColumn}>
              <ExerciseSearch
                onAddExercise={handleAddExercise}
                onAddCustomExercise={handleAddCustomExercise}
              />
              <ExerciseList
                dateInfo={dateInfo}
                exercises={selectedExercises}
                onExerciseNameChange={handleExerciseNameChange}
              />
            </div>
          </div>
        </div>
      </div>
      <ExerciseMemo dateInfo={dateInfo} />
      <button className={styles.saveButton} onClick={handleSave}>
        저장하기
      </button>
      <button className={styles.saveButton} onClick={handleEdit}>
        수정하기
      </button>
    </div>
  );
};

export default Exercise;
