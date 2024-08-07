import React from 'react';

interface CategoryProps {
  boardType: string;
  boardCategory: string;
  handleBoardTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleBoardCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Category: React.FC<CategoryProps> = ({ boardType, boardCategory, handleBoardTypeChange, handleBoardCategoryChange }) => {
  return (
    <>
      <select value={boardType} onChange={handleBoardTypeChange}>
        <option value="FREE">자유게시판</option>
        <option value="WORKOUT">운동게시판</option>
        <option value="DIET">식단게시판</option>
      </select>
      <select value={boardCategory} onChange={handleBoardCategoryChange}>
        {/* <option value="NONE">카테고리 없음</option> */}
        <option value="WORKOUT">운동</option>
        <option value="AD">광고</option>
        <option value="CONCERN">상담</option>
        <option value="HOBBY">취미</option>
        <option value="NEIGHBOR">동네</option>
        <option value="ETC">기타</option>
      </select>
    </>
  );
};

export default Category;
