import React from 'react'
import styled from 'styled-components';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImageSelect: (imageNumber: number) => void;
}

const ImageEditModal: React.FC<ModalProps> = ({isOpen, onClose, onImageSelect}) => {
    if(!isOpen) return null;

    return (
        <ModalOverlay>
            <ModalContent>
                <p>어느 사진을 수정하시겠습니까?</p>
                <ModalButton onClick={() => onImageSelect(1)}>첫 번째 사진</ModalButton>
                <ModalButton onClick={() => onImageSelect(2)}>두 번째 사진</ModalButton>
                <ModalButton onClick={() => onClose()}>취소</ModalButton>
            </ModalContent>
        </ModalOverlay>
    )
}

export default ImageEditModal;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 0.625rem;
    text-align: center;
`;

const ModalButton = styled.button`
    margin: 0.5rem;
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