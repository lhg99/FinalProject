import React, { useState } from 'react'
import styled from 'styled-components';

interface CustomExerciseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (exerciseName: string) => void;
}

const CustomExerciseModal: React.FC<CustomExerciseModalProps> = ({isOpen, onClose, onSave}) => {
    const [exerciseName, setExerciseName] = useState<string>("");
    if(!isOpen) return null;

    const handleSave = () => {
        onSave(exerciseName);
        onClose();
    }

    return (
        <ModalOverlay>
            <ModalContainer>
                <ModalHeader>
                    <h2>직접 입력하기</h2>
                    <CloseButton onClick={onClose}>×</CloseButton>
                </ModalHeader>
                <ModalBody>
                    <Input
                        type="text"
                        placeholder="운동 이름 입력"
                        value={exerciseName}
                        onChange={(e) => setExerciseName(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <SaveButton onClick={handleSave}>저장</SaveButton>
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    )
}

export default CustomExerciseModal;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ModalContainer = styled.div`
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    width: 400px;
    max-width: 100%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
`;

const ModalBody = styled.div`
    margin-bottom: 1rem;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    font-size: 1rem;
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const SaveButton = styled.button`
    background: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;

    &:hover {
        background: #0056b3;
    }
`;