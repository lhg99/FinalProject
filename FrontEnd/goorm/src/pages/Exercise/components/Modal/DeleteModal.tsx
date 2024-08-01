import React from 'react'
import styled from 'styled-components';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({isOpen, onClose, onConfirm}) => {
    if(!isOpen) return null;

    return (
        <ModalOverlay>
            <ModalContainer>
                <ModalHeader>
                    <h2>삭제 확인</h2>
                </ModalHeader>
                <ModalBody>
                    <p>정말로 이 운동 기록을 삭제하시겠습니까?</p>
                </ModalBody>
                <ModalFooter>
                    <ConfirmButton onClick={onConfirm}>네</ConfirmButton>
                    <CancelButton onClick={onClose}>아니요</CancelButton>
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    )
}

export default DeleteModal;

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

const ModalBody = styled.div`
    margin-bottom: 1rem;
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.625rem;
`;

const CancelButton = styled.button`
    background: #ccc;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    margin-right: 0.5rem;

    &:hover {
        background: #bbb;
    }
`;

const ConfirmButton = styled.button`
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