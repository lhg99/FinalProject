import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useExercise } from "../../contexts/exerciseContext";
import { ModalStore } from "../../store/store";
import axiosInstance from "../../api/axiosInstance";
import { formatDateInfo } from "../../utils/DateUtils";

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
      const memoContent = record?.memo || "";
      setEditorData(memoContent);

      setMemo({
        content: memoContent,
        date: formattedDate,
      });
    }
  }, [dateInfo, exerciseRecords]);

  return (
    <MemoContainer>
      <MemoDetails>
        <DetailsText>메모</DetailsText>
        {!isAnyModalOpen() && (
          <CKEditor
            editor={ClassicEditor}
            data={editorData}
            onChange={(event, editor) => {
              const data = editor.getData();
              setEditorData(data);
              if (dateInfo) {
                const formattedDate = formatDateInfo(dateInfo);
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

export default ExerciseMemo;

const MemoContainer = styled.div`
  display: flex;
  background-color: white;
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
