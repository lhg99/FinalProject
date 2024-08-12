import React, { useState } from 'react'
import styled from 'styled-components';
import { postUserDetailInfo, UserDetailInfo } from '../../../api/mypageApi';

interface UserInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserInfoModal = ({ isOpen, onClose }: UserInfoModalProps) => {
    const [age, setAge] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    if(!isOpen) return null;

    const handleSave = async() => {
        if (comment.trim() === "") {
            setErrorMessage("코멘트를 입력해주세요.");
            return;
        }
        const userData: UserDetailInfo = {
            age: parseInt(age),
            memberHeight: parseInt(height),
            memberWeight: parseInt(weight),
            gender: gender,
            comment: comment
        }

        try {
            await postUserDetailInfo(userData);
        } catch (error) {
            console.error("유저 추가정보 post 실패", error);
        } finally {
            onClose();
        }
    }

    return (
        <ModalOverlay>
            <ModalContainer>
                <ModalHeader>
                    <h2>유저 추가정보 입력</h2>
                    <CloseButton onClick={onClose}>×</CloseButton>
                </ModalHeader>
                <ModalBody>
                    <Input
                        type="text"
                        placeholder="나이"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    />
                </ModalBody>
                <ModalBody>
                    <Input
                        type="text"
                        placeholder="키"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    />
                </ModalBody>
                <ModalBody>
                    <Input
                        type="text"
                        placeholder="몸무게"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </ModalBody>
                <ModalBody>
                    <Input
                        as="select"
                        placeholder="성별"
                        value={gender}
                        onChange={(e) => {
                            const gender = e.target.value;
                            if(gender === "남")
                                setGender("male");
                            else if(gender === "여")
                                setGender("female");
                        }}
                        >
                        <option value="" disabled>
                            성별 선택
                        </option>
                        <option value="남">남</option>
                        <option value="여">여</option>
                    </Input>
                </ModalBody>
                <ModalBody>
                    <Input
                        type="text"
                        placeholder="코멘트(필수 입력)"
                        value={comment}
                        onChange={(e) => {
                            setComment(e.target.value);
                            setErrorMessage("");
                        }}
                    />
                    {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
                </ModalBody>
                <ModalFooter>
                    <SaveButton onClick={handleSave}>저장</SaveButton>
                    <CancelButton onClick={onClose}>취소</CancelButton>
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    )
}

export default UserInfoModal;

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
    margin-right: 1.25rem;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    font-size: 1rem;
`;

const ErrorText = styled.p`
    color: red;
    font-size: 0.875rem;
    margin-top: 0.5rem;
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.625rem;
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

const CancelButton = styled.button`
    background: #ccc;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    margin-right: 1.25rem;

    &:hover {
        background: #bbb;
    }
`;