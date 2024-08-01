import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useExercise } from "../../contexts/exerciseContext";
import ImageEditModal from "./components/Modal/ImageEditModal";

interface ExerciseMemoProps {
  onFileUpload: (file: File) => void;
}

const ExerciseMemo: React.FC<ExerciseMemoProps> = ({onFileUpload}) => {
  const [imagePreviewUrl1, setImagePreviewUrl1] = useState<string | null>(null);
  const [imagePreviewUrl2, setImagePreviewUrl2] = useState<string | null>(null);
  const { state: { imageFile }, setImageFile } = useExercise();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      if (!imagePreviewUrl1) {
        setImagePreviewUrl1(previewUrl);
      } else {
        setImagePreviewUrl2(previewUrl);
      }
      onFileUpload(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  const handleImageModify = () => {
    setIsModalOpen(true);
  }

  const handleImageSelect = (imageNumber: number) => {
    setSelectedImage(imageNumber);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <MemoContainer>
      <MemoDetails>
        <DetailsText>메모</DetailsText>
        <MemoDetailsTextArea placeholder='운동 관련 메모 기록하기'></MemoDetailsTextArea>
      </MemoDetails>
      <ImageWrapper>
        <ImageContainer>
          {imagePreviewUrl1 && <ImagePreview src={imagePreviewUrl1} alt="미리보기 이미지" />}
        </ImageContainer>
        <ImageContainer>
          {imagePreviewUrl2 && <ImagePreview src={imagePreviewUrl2} alt="미리보기 이미지" />}
        </ImageContainer>
      </ImageWrapper>
      <ButtonWrapper>
        <Button onClick={handleImageModify}>사진 수정</Button>
        <FileInputLabel>
          사진 추가
          <HiddenImageInput ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />
        </FileInputLabel>
      </ButtonWrapper>
      {isModalOpen && (
        <ImageEditModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onImageSelect={handleImageSelect} 
        />
      )}
    </MemoContainer>
  )
}

export default ExerciseMemo

const MemoContainer = styled.div`
  display: flex;
  margin-top: 20px;
  width: 76%;
  height: 31.25rem;
  margin-left: 23.75rem;
  flex-direction: column;
`;

const MemoDetails = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  border: 1px solid black;
  border-right: none;
  height: 50%;
`;

const DetailsText = styled.p `
  width: 5%;
  margin-left: 1.25rem;
  margin-right: 1.25rem;
  font-size: 0.875rem;
  font-weight: bold;
`;

const MemoDetailsTextArea = styled.textarea`
  width: 100%;
  height: 98%;
  font-size: 0.875rem;
  resize: none;
  border: none;
  border-left: 1px solid black;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  font-size: 0.875rem;
  font-weight: 500;
`;

const ImageWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
  margin-top: 0.625rem;
`

const ImageContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  border: 1.5px solid black;
  border-radius: 0.3125rem;
`;

const ImagePreview = styled.img`
  margin-top: 10px;
  margin-bottom: 0.625rem;
  max-width: 100%;
  max-height: 100%;
  border-radius: 0.625rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 1.25rem;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border: 1px solid #AFAFAF;
  border-radius: 0.3125rem;
  background-color: white;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const FileInputLabel = styled.label`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border: 1px solid #AFAFAF;
  border-radius: 0.3125rem;
  background-color: white;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const HiddenImageInput = styled.input`
  display: none;
`;