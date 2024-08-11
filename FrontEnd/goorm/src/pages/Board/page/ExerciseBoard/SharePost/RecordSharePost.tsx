import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecordSharePost.module.scss';
import { getExerciseRecords } from '../../../../../api/Exercise/exerciseApi';
import { addPost } from '../../../api/boardAPI';
import TextEditor from '../../../../../components/TextEditor/TextEditor';
import { ExerciseRecords } from '../../../../Exercise/ExerciseTypes'; // ExerciseRecords 타입 임포트
import Exercise from '../../../../Exercise/Exercise';

const RecordSharePost: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [boardType, setBoardType] = useState<string>('WORKOUT');
  const [boardCategory, setBoardCategory] = useState<string>('WORKOUT'); // 서버에서 허용된 카테고리 값으로 수정
  const [exerciseRecords, setExerciseRecords] = useState<ExerciseRecords[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]); // string 배열로 처리

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const records = await getExerciseRecords();
        setExerciseRecords(records);
      } catch (error) {
        console.error('운동 기록을 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchExerciseData();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (data: string) => {
    setContent(data);
  };

  const handleBoardTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBoardType(e.target.value);
  };

  const handleBoardCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBoardCategory(e.target.value);
  };

  const handleRecordSelect = (recordId: number) => { 
    const recordIdString = recordId.toString(); // 숫자를 문자열로 변환
    setSelectedRecords((prevSelected) => 
      prevSelected.includes(recordIdString)
        ? prevSelected.filter(id => id !== recordIdString)
        : [...prevSelected, recordIdString]
    );
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !boardType.trim() || !boardCategory.trim()) {
      alert('모든 필수 입력 필드를 입력해주세요.');
      return;
    }

    try {
      const postData = {
        boardTitle: title,
        boardContent: content,
        boardType: boardType,
        boardCategory: boardCategory,
        trainingRecords: selectedRecords, // string 배열로 전달
      };

      await addPost(postData);
      alert('게시글이 성공적으로 작성되었습니다.');
      navigate(`/Board/exercise`);
    } catch (error) {
      alert('게시글 작성 중 오류가 발생했습니다.');
      console.error('게시글 작성 중 오류가 발생했습니다:', error);
    }
  };

  return (
    <div className={styles.postContainer}>
      <h2>기록 공유</h2>
      <form onSubmit={handleSave}>
        <select value={boardType} onChange={handleBoardTypeChange}>
          <option value="WORKOUT">운동 게시판</option>
          <option value="FOOD">식단 게시판</option>
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
          placeholder='제목' 
          value={title} 
          onChange={handleTitleChange} 
          required
        />
        <TextEditor defaultValue={content} onChange={handleContentChange} />

        <h3>나의 운동 리스트</h3>
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
              {exerciseRecords.map(record => (
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
                  <td>{record.caloriesBurned ? record.caloriesBurned + ' kcal' : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" className={styles.backButton} onClick={() => navigate(`/Board/${boardType.toLowerCase()}`)}>작성 취소</button>
          <button type="submit" className={styles.submitButton}>작성 완료</button>
        </div>
      </form>
    </div>
  );
};

export default RecordSharePost;
