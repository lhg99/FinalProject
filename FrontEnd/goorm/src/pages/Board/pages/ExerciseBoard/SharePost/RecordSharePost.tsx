import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecordSharePost.module.scss';
import { getExerciseRecords } from '../../../../../api/Exercise/exerciseApi';
import { addPost } from '../../../api/boardAPI';
import TextEditor from '../../../../../components/TextEditor/TextEditor';
import { ExerciseRecords } from '../../../../Exercise/ExerciseTypes'; 
import { FoodRecord } from '../../../../Food/FoodTypes'; 
import FoodRecordsList from './FoodRecordsList';

const RecordSharePost: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [boardType, setBoardType] = useState<string>('FREE'); 
  const [boardCategory, setBoardCategory] = useState<string>('WORKOUT');
  const [exerciseRecords, setExerciseRecords] = useState<ExerciseRecords[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ExerciseRecords[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('AUG');

  const monthMapping: { [key: string]: number } = {
    JAN: 0,
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11,
  };

  useEffect(() => {
    if (boardType === 'WORKOUT') {
      const fetchExerciseData = async () => {
        try {
          const records = await getExerciseRecords();
          setExerciseRecords(records);
          console.log('Fetched exercise records:', records);
        } catch (error) {
          console.error('운동 기록을 불러오는 중 오류가 발생했습니다:', error);
        }
      };
      fetchExerciseData();
    }
  }, [boardType]);

  useEffect(() => {
    if (boardType === 'WORKOUT') {
      const filterRecordsByMonth = () => {
        const monthIndex = monthMapping[selectedMonth];
        const filtered = exerciseRecords
          .filter(record => {
            const recordMonth = new Date(record.exerciseDate).getMonth();
            return recordMonth === monthIndex;
          })
          .sort((a, b) => new Date(b.exerciseDate).getTime() - new Date(a.exerciseDate).getTime());
        setFilteredRecords(filtered);
        console.log(`Filtered exercise records for month ${selectedMonth}:`, filtered);
      };

      filterRecordsByMonth();
    }
  }, [selectedMonth, exerciseRecords, boardType]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (data: string) => {
    setContent(data);
  };

  const handleBoardTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBoardType(e.target.value);
    console.log('Board type changed to:', e.target.value);
    setBoardCategory('WORKOUT');
    setSelectedRecords([]);
  };

  const handleBoardCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBoardCategory(e.target.value);
    console.log('Board category changed to:', e.target.value);
  };

  const handleRecordSelect = (recordId: number) => { 
    const recordIdString = recordId.toString();
    setSelectedRecords((prevSelected) => 
      prevSelected.includes(recordIdString)
        ? prevSelected.filter(id => id !== recordIdString)
        : [...prevSelected, recordIdString]
    );
    console.log('Selected records:', selectedRecords);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!title.trim() || !content.trim() || !boardCategory.trim()) {
      alert('모든 필수 입력 필드를 입력해주세요.');
      return;
    }
  
    try {
      const postData = {
        boardTitle: title,
        boardContent: content,
        boardType: boardType, 
        boardCategory: boardCategory,
        trainingRecords: boardType === 'WORKOUT' ? selectedRecords : [], 
        dietRecords: boardType === 'DIET' ? selectedRecords : [], 
      };
      console.log('Submitting post data:', postData);
      await addPost(postData);
      alert('게시글이 성공적으로 작성되었습니다.');
      navigate(`/Board/${boardType.toLowerCase()}`);
    } catch (error) {
      alert('게시글 작성 중 오류가 발생했습니다.');
      console.error('게시글 작성 중 오류가 발생했습니다:', error);
    }
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    console.log('Selected month changed to:', month);
  };

  const getMealTimeLabel = (mealTime: string): string => {
    switch (mealTime) {
      case 'BREAKFAST':
        return '아침';
      case 'LUNCH':
        return '점심';
      case 'DINNER':
        return '저녁';
      case 'SNACK':
        return '간식';
      default:
        return mealTime;
    }
  };
  
  return (
    <div className={styles.Container}>
      <div className={styles.postContainer}>
        <h2>{boardType === 'FREE' ? '게시글 작성' : '기록 공유'}</h2>
        <form onSubmit={handleSave}>
          <select value={boardType} onChange={handleBoardTypeChange}>
            <option value="FREE">자유게시판</option>
            <option value="WORKOUT">운동 게시판</option>
            <option value="DIET">식단 게시판</option>
          </select>
          <select value={boardCategory} onChange={handleBoardCategoryChange}>
            <option value="WORKOUT">운동</option>
            <option value="AD">광고</option>
            <option value="CONCERN">상담</option>
            <option value="HOBBY">취미</option>
            <option value="NEIGHBOR">동네</option>
            <option value="ETC">기타</option>
          </select>
          <input 
            type='text' 
            placeholder='제목을 입력해주세요.' 
            value={title} 
            onChange={handleTitleChange} 
            required
          />
          <TextEditor defaultValue={content} onChange={handleContentChange} />

          {boardType !== 'FREE' && (
            <>
              <h5 className={styles.h5}>나의 {boardType === 'WORKOUT' ? '운동' : '식단'} 리스트</h5>
              <div className={styles.monthTabs}>
                {Object.keys(monthMapping).map((month) => (
                  <button
                    key={month}
                    className={`${styles.tabButton} ${selectedMonth === month ? styles.activeTab : ''}`}
                    onClick={() => handleMonthChange(month)}
                    type="button"
                  >
                    {`${monthMapping[month] + 1}월`}  
                  </button>
                ))}
              </div>

              {boardType === 'WORKOUT' ? (
                <div className={styles.exerciseList}>
                  <table>
                    <thead>
                      <tr>
                        <th>선택</th>
                        <th>날짜</th>
                        <th>운동</th>
                        <th>시간</th>
                        <th>칼로리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map(record => (
                        <tr key={record.recordId}>
                          <td>
                            <input 
                              type="checkbox" 
                              checked={selectedRecords.includes(record.recordId.toString())} 
                              onChange={() => handleRecordSelect(record.recordId)} 
                            />
                          </td>
                          <td>{record.exerciseDate}</td>
                          <td>{record.trainingName}</td>
                          <td>{record.durationMinutes} 분</td>
                          <td>{record.caloriesBurned ? record.caloriesBurned + ' kcal' : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <FoodRecordsList
                  selectedMonth={selectedMonth}
                  selectedRecords={selectedRecords}
                  handleRecordSelect={handleRecordSelect}
                />
              )}
            </>
          )}

          <div className={styles.buttonGroup}>
            <button type="button" className={styles.backButton} onClick={() => navigate(`/Board/${boardType.toLowerCase()}`)}>작성 취소</button>
            <button type="submit" className={styles.submitButton}>작성 완료</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordSharePost;
