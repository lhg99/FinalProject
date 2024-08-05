import React, { useState, useEffect, useRef, memo } from 'react';
import styled from 'styled-components';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { useExercise } from '../../../../contexts/exerciseContext';
import { EditExerciseRecord } from '../../api/exerciseApi';
import { ExerciseRecords } from '../../ExerciseTypes';

interface MemoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  memoId: number; // ID for the memo
}

const MemoEditModal: React.FC<MemoEditModalProps> = ({ isOpen, onClose, memoId }) => {
  const { state: { exerciseDetails, exerciseRecords }, updateExerciseDetails } = useExercise(); // useExercise 훅을 사용하여 context API로부터 데이터를 가져옴
  const [editorData, setEditorData] = useState<string>("");
  const prevIsOpenRef = useRef<boolean>(false);

  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {  // 모달이 열리고 이전 상태가 닫혀있었을 때만 실행
      // memoId에 해당하는 단일 기록을 찾음
      const currentRecord = Object.values(exerciseDetails).find(record => record.recordId === memoId);
      if (currentRecord) {
        console.log("currentRecord: ", currentRecord);
        setEditorData(currentRecord.memo || "");
      }
    }
    prevIsOpenRef.current = isOpen;  // 현재 열림 상태를 저장
  }, [isOpen, memoId, exerciseDetails]);

  const handleMemoSave = async () => {
    // memoId에 해당하는 단일 기록을 찾음
    const currentRecord = Object.values(exerciseDetails).find(record => record.recordId === memoId);
    if (currentRecord) {
      const updatedRecord: ExerciseRecords = {
        ...currentRecord,
        memo: editorData, // Update memo data
      };

      try {
        // Call the EditExerciseRecord function to update the server
        await EditExerciseRecord(memoId, updatedRecord);
        updateExerciseDetails(updatedRecord); // Update context state
        alert("운동기록 수정 성공");
        onClose(); // Close modal
      } catch (error) {
        console.error("운동기록 수정 중 오류 발생:", error);
      }
    }
  };

  if (!isOpen) return null; // 모달이 열려있지 않으면 아무것도 렌더링하지 않음

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>메모 수정하기</h2>
        <CKEditor
            editor={ClassicEditor}
            data={editorData} // CKEditor의 초기 데이터를 editorData 상태로 설정
            onChange={(event, editor) => {
                const data = editor.getData();
                setEditorData(data); // 에디터의 변경 내용을 상태에 저장
            }}
            config={{
                toolbar: [
                    'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'imageUpload'
                ],
                ckfinder: {
                    uploadUrl: `${axios.defaults.baseURL}/s3/ck/upload`, // 이미지 업로드 서버 엔드포인트
                },
                image: {
                    toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side']
                }
            }}
        />
        <ButtonContainer>
          <Button onClick={handleMemoSave}>수정하기</Button>
          <Button onClick={onClose}>닫기</Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default MemoEditModal;

// 스타일링 부분
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;