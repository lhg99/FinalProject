import React from 'react'
import styled from 'styled-components';
import { useFood } from '../../../contexts/foodContext';

interface FoodInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const FoodInfoModal = ({ isOpen, onClose, onConfirm }: FoodInfoModalProps) => {
    if(!isOpen) return null;

    // const {state: {foodRecords} } = useFood();

    return (
        <ModalOverlay>
            {/* <ModalContainer>
                <ModalHeader>
                    <h2>음식 상세정보</h2>
                </ModalHeader>
                <ModalBody>
                    <p>칼로리: </p>
                </ModalBody>
                <ModalFooter>
                    <ConfirmButton onClick={onConfirm}>네</ConfirmButton>
                    <CancelButton onClick={onClose}>아니요</CancelButton>
                </ModalFooter>
            </ModalContainer> */}
        </ModalOverlay>
    )
}

export default FoodInfoModal;

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