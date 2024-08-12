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
import { ExerciseData } from "./ExerciseTypes";
import DateSelector from "./components/Date/DateSelector";
import { EditExerciseRecord, postCardioRecord, postCustomExerciseData, postExerciseMemo, postStrengthRecord } from "../../api/Exercise/exerciseApi";
import { formatDateInfo } from "../../utils/DateUtils";
import { EditExerciseRecordRequest, PostCardioRecordRequest, PostStrengthRecordRequest } from "../../api/Exercise/dto/ExerciseRequest";
import { ToastStore } from "../../store/store";
import ToastComponent from "../../components/Toast/ToastComponent";

const Exercise: React.FC = () => {
  const [dateInfo, setDateInfo] = useState<{ 
    year: number; month: number; day: number; weekday: string; formattedDate: string 
  } | null>(null);

  const { showToast } = ToastStore();


  const {
    state: {
      selectedExercises, exerciseRecords, exerciseDetails, startDate,
      endDate, memo, selectedExerciseRecords }, addSelectedExercises, 
      addCustomExercises, setStartDate, setEndDate } = useExercise();

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

  const handleDateChange = useCallback(
    (info: { year: number; month: number; day: number; weekday: string }) => {
      const formattedDate = formatDateInfo(info);
      setDateInfo({ ...info, formattedDate });
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

        console.log("Payload to send:", customExercisePayload);
        const newExerciseId: number = await postCustomExerciseData(
          customExercisePayload
        );
        customExercise.id = newExerciseId;
      }

      for (const exercise of selectedExercises) {
        const details = exerciseDetails[exercise.name] || {};
        const existingRecord = exerciseRecords.find(
          (record) => record.trainingId === exercise.id
        );

        const recordData = {
          trainingId: exercise.id,
          durationMinutes: details.durationMinutes || 0,
          satisfaction: details.satisfaction || 0,
          intensity: details.intensity || "",
        };
        if (!existingRecord) {
          if (exercise.categoryName === "유산소") {
            const cardioRecordData: PostCardioRecordRequest = {
              ...recordData,
              caloriesBurned: details.caloriesBurned || 0,
              distance: details.distance,
              incline: details.incline || 0,
            };
            await postCardioRecord(cardioRecordData);
          } else {
            const strengthRecordData: PostStrengthRecordRequest = {
              ...recordData,
              sets: details.sets || 0,
              weight: details.weight || 0,
              reps: details.reps || 0,
            };
            await postStrengthRecord(strengthRecordData);
          }
          console.log("Created record:", recordData);
        }
      }
      await postExerciseMemo(memo.content);
      showToast("saveToast", "운동 기록이 저장되었습니다.");
    } catch (err) {
      console.error("운동기록 저장 실패", err);
    }
  };

  const handleEdit = async () => {
    try {
      // EditExerciseRequest 객체 생성
      const editRequest: EditExerciseRecordRequest = {
        exerciseRecords: selectedExerciseRecords,
        memos: memo
      };
      
      // 수정된 EditExerciseRecord 함수 호출
      await EditExerciseRecord(editRequest);
      
      // 수정 성공 시 토스트 메시지 표시
      showToast("editToast", "운동 기록이 수정되었습니다.");
    } catch (err) {
      console.error("운동기록 수정 실패", err);
    }
  };

  return (
    <div className={styles.pageBackground}>
      <div className={styles.exercise}>
        <ToastComponent />
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
                />
              </div>
            </div>
          </div>
        </div>
        <ExerciseMemo dateInfo={dateInfo} />
        <div className={styles.buttonContainer}>
          <button className={styles.saveButton} onClick={handleEdit}>수정하기</button>
          <button className={styles.saveButton} onClick={handleSave}>저장하기</button>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
