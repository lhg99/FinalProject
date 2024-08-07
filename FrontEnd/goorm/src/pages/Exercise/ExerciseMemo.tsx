import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useExercise } from "../../contexts/exerciseContext";
import { ModalStore } from "../../store/store";
import axiosInstance from "../../api/axiosInstance";
import { formatDateData, formatDateInfo } from "../../utils/DateUtils";

interface ExerciseMemoProps {
  dateInfo: {
    year: number;
    month: number;
    day: number;
    weekday: string;
    formattedDate: string;
  } | null;
}

const ExerciseMemo = ({dateInfo}:ExerciseMemoProps) => {
  const {
    state: { exerciseRecords },
    setMemo
  } = useExercise();
  const { isAnyModalOpen } = ModalStore();
  const [editorData, setEditorData] = useState<string>("");

  useEffect(() => {
    if (dateInfo) {
      const formattedDate = formatDateInfo(dateInfo);
      const record = exerciseRecords.find(
        (record) => record.exerciseDate === formattedDate
      );
      const memoContent = record?.memo || ""; // Default to empty if no memo is found
      setEditorData(memoContent);

      // Set memo on initial load
      setMemo({
        content: memoContent,
        date: formattedDate,
      });
    }
  }, [dateInfo, exerciseRecords]); // Depend on dateInfo and exerciseRecords

  return (
    <MemoContainer>
      <MemoDetails>
        <DetailsText>메모</DetailsText>
        {!isAnyModalOpen() && ( // 다른 모달이 열려있지 않을 때 CKeditor 표시
          <CKEditor
            editor={ClassicEditor}
            data={editorData}
            onChange={(event, editor) => {
              const data = editor.getData();
              setEditorData(data);
              // 선택된 날짜에 대한 메모를 업데이트합니다
              if (dateInfo) {
                const formattedDate = formatDateInfo(dateInfo); // 날짜 형식화
                setMemo({
                  content: data,
                  date: formattedDate,
                }); // Update memo
              }
            }}
            onBlur={(event, editor) => {
              const data = editor.getData();
            }}
            config={{
              toolbar: [
                "heading",
                "|",
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "blockQuote",
                "imageUpload",
              ],
              ckfinder: {
                uploadUrl: `${axiosInstance.defaults.baseURL}/s3/ck/upload`,
              },
            }}
          />
        )}
      </MemoDetails>
    </MemoContainer>
  );
};

export default ExerciseMemo;

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
  flex-direction: row; /* Stack items vertically */
  border-right: none;
  height: 100%;

  .ck.ck-editor__main > .ck-editor__editable {
    width: 68.75rem;
    height: 430px;
    max-height: 430px;
    overflow-y: auto;
    border: 1px solid black;
    font-size: 0.875rem;
  }
`;

const DetailsText = styled.p`
  width: 5%;
  margin-left: 1.25rem;
  margin-right: 1.25rem;
  flex-direction: row;
  font-size: 0.875rem;
  font-weight: bold;
`;
