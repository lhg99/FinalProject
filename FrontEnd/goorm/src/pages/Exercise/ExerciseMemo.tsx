import React, { useState } from "react";
import styled from "styled-components";

interface ExerciseMemoProps {
  onFileUpload: (file: File) => void;
}

const ExerciseMemo: React.FC<ExerciseMemoProps> = ({onFileUpload}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      onFileUpload(file);
    }
  }

  return (
    <MemoContainer>
      <ImageContainer>
        <ImageInput type="file" accept="image/*" onChange={handleFileChange}/>
        {selectedFile && <p>선택된 파일: {selectedFile.name}</p>}
      </ImageContainer>
      <MemoDetails>
        <h2>운동 메모</h2>
        <MemoDetailsInput className="memo-input" type="text" placeholder='운동 관련 메모 기록하기'></MemoDetailsInput>
      </MemoDetails>
    </MemoContainer>
  )
}

export default ExerciseMemo

const MemoContainer = styled.div`
  display: flex;
  margin-top: 10px;
  width: 125rem;
  height: 12.5rem;
  margin-left: 23.75rem;
`;

const ImageContainer = styled.div`
  display: flex;
  width: 31.25rem;
  border: 1px solid black;
  border-radius: 0.625rem;
`;

const ImageInput = styled.input`
  margin-top: 0.625rem;
  margin-left: 0.625rem;
`;

const MemoDetails = styled.div`
  display: flex;
  margin-left: 1.25rem;
  margin-right: 1.875rem;
  border: 1px solid black;
  border-radius: 0.625rem;
`;

const MemoDetailsInput = styled.input`
  margin-left: 0.625rem;
  width: 1050px;
  font-size: 1rem;
  border: 1px solid black;
  border-top-right-radius: 0.625rem;
  border-bottom-right-radius: 0.625rem;
`;