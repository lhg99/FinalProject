import React, { useRef, useState } from "react";
import styled from "styled-components";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axiosInstance from "../../api/axiosInstance";
import { useExercise } from "../../contexts/exerciseContext";

const ExerciseMemo: React.FC = () => {
  const { state: {
    exerciseDetails, exerciseRecords
  }, addMemo } = useExercise();
  const [editorData, setEditorData] = useState<string>("");

  const { state: { isDeleteModalOpen, isEditModalOpen } } = useExercise();

  const recordId = exerciseRecords.length > 0 ? exerciseRecords[exerciseRecords.length - 1].recordId + 1 : 1; 

  const currentRecord = Object.values(exerciseDetails).find(record => record.recordId === recordId - 1);
  const currentMemo = currentRecord ? currentRecord.memo : "여기에 운동메모를 기록하세요.";

  return (
    <MemoContainer>
      <MemoDetails>
        <DetailsText>메모</DetailsText>
        {!isDeleteModalOpen && !isEditModalOpen && (  // 메모 모달이 열려 있지 않을 때만 CKEditor 표시
          <CKEditor 
            editor={ClassicEditor} 
            data="<p>여기에 운동메모를 입력하세요</p>"
            onChange={(event, editor) => {
              const data = editor.getData();
              setEditorData(data);
            }}
            onBlur={(event, editor) => {
              const data = editor.getData();
              addMemo(recordId, data.toString());
              console.log("recordId and data: " + recordId + data);
            }} 
            config={{
              toolbar: [
                'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'
              ]
            }}
          />
        )}
        <CKEditor 
            editor={ClassicEditor} 
            data=""
            onChange={(event, editor) => {
              const data = editor.getData();
              setEditorData(data);
            }}
            onBlur={(event, editor) => {
              const data = editor.getData();
              addMemo(recordId, data.toString());
              console.log("recordId and data: " + recordId + data);
            }} 
            config={{
              toolbar: [
                'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'imageUpload'
              ],
              ckfinder: {
                uploadUrl: `${axiosInstance.defaults.baseURL}/s3/ck/upload`, // 이미지 업로드를 위한 서버 엔드포인트
              },
              image: {
                toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side']
              }
            }}
          />
      </MemoDetails>
    </MemoContainer>
  )
}

export default ExerciseMemo

const MemoContainer = styled.div`
  display: flex;
  margin-top: 0.625rem;
  width: 76%;
  height: 470px;
  margin-left: 23.75rem;
  flex-direction: column;
  margin-bottom: 20px;
`;

const MemoDetails = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  border: 1px solid black;
  border-right: none;
  height: 100%;

  .ck-editor {
    z-index: 1; /* 다른 UI 요소보다 낮게 설정 */
  }

  .ck.ck-editor__main > .ck-editor__editable {
    width: 68.75rem;
    height: 430px;
    max-height: 430px;
    overflow-y: auto;
    border: 1px solid black;
    font-size: 0.875rem;
  }
`;

const DetailsText = styled.p `
  width: 5%;
  margin-left: 1.25rem;
  margin-right: 1.25rem;
  font-size: 0.875rem;
  font-weight: bold;
`;