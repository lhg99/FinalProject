import React, { useState } from "react";
import styled from "styled-components";
import { ExerciseStore } from "../../store/store";

interface ExerciseMemoProps {
  onFileUpload: (file: File) => void;
}

const ExerciseMemo: React.FC<ExerciseMemoProps> = ({onFileUpload}) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const setImageFile = ExerciseStore(state => state.setImageFile);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      onFileUpload(file);
    }
  }

  return (
    <MemoContainer>
      <ImageContainer>
        <ImageInput type="file" accept="image/*" onChange={handleFileChange}/>
        {imagePreviewUrl && <ImagePreview src={imagePreviewUrl} alt="미리보기 이미지" />}
      </ImageContainer>
      <MemoDetails>
        <DetailsText>메모</DetailsText>
        <MemoDetailsInput className="memo-input" type="text" placeholder='운동 관련 메모 기록하기'></MemoDetailsInput>
      </MemoDetails>
    </MemoContainer>
  )
}

export default ExerciseMemo

const MemoContainer = styled.div`
  display: flex;
  margin-top: 20px;
  width: 100%;
  height: 12.5rem;
  margin-left: 410px;
`;

const ImageContainer = styled.div`
  display: flex;
  width: 30%;
  height: 100%;
  border: 1.5px solid black;
  border-radius: 0.3125rem;
`;

const ImageInput = styled.input`
  margin-top: 0.625rem;
  margin-left: 0.625rem;
`;

const ImagePreview = styled.img`
  margin-top: 10px;
  margin-bottom: 0.625rem;
  max-width: 100%;
  max-height: 100%;
  border-radius: 0.625rem;
`;

const MemoDetails = styled.div`
  display: flex;
  width: 43%;
  margin-left: 1.25rem;
  margin-right: 1.875rem;
  border: 1px solid black;
`;

const DetailsText = styled.p `
  width: 5%;
  margin-left: 1.25rem;
  margin-right: 1.25rem;
  font-size: 0.875rem;
  font-weight: bold;
`;

const MemoDetailsInput = styled.input`
  width: 100%;
  font-size: 0.875rem;
  border-top: none;
  border-right: none;
  border-bottom: none;
  border-left: 1px solid black;
`;