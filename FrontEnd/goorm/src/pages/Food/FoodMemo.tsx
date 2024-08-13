import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useExercise } from "../../contexts/exerciseContext";
import { ModalStore } from "../../store/store";
import axiosInstance from "../../api/axiosInstance";
import { formatDateInfo } from "../../utils/DateUtils";
import { useFood } from "../../contexts/foodContext";

interface FoodMemoProps {
  dateInfo: {
    year: number;
    month: number;
    day: number;
    weekday: string;
    formattedDate: string;
  } | null;
}

const FoodMemo = ({ dateInfo }: FoodMemoProps) => {
  const {
    state: { foodRecords },
    setMemo,
  } = useFood();
  const { isAnyModalOpen } = ModalStore();
  const [editorData, setEditorData] = useState<string>("");

  useEffect(() => {
    if (dateInfo) {
      const formattedDate = formatDateInfo(dateInfo);
      const record = foodRecords.find(
        (record) => record.dietDate === formattedDate
      );
      const memoContent = record?.memo || ""; // Default to empty if no memo is found
      setEditorData(memoContent);

      // Set memo on initial load
      setMemo({
        content: memoContent,
        date: formattedDate,
      });
    }
  }, [dateInfo, foodRecords]); // Depend on dateInfo and exerciseRecords

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
                });
              }
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

export default FoodMemo;

const MemoContainer = styled.div`
  display: flex;
  width: 76%;
  height: 470px;
  margin-left: 23.75rem;
  flex-direction: column;
  margin-bottom: 20px;
  background-color: white;
  margin-top: 0.625rem;
`;

const MemoDetails = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  flex-direction: row; /* Stack items vertically */
  border-right: none;
  height: 100%;

  .ck.ck-editor__main > .ck-editor__editable {
    width: 68.75rem;
    height: 430px;
    max-height: 430px;
    overflow-y: auto;
    font-size: 0.875rem;
  }
`;

const DetailsText = styled.p`
  width: 5%;
  margin-left: 1.25rem;
  margin-right: 1.25rem;
  margin-top: 0.625rem;
  flex-direction: row;
  font-size: 0.875rem;
  text-align: center;
`;
