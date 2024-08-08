import React from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

const SearchBarContainer = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 0;

  & input {
    width: 100%;
    max-width: 400px;
    height: 45px;
    font-size: 16px;
    border: 1px solid lightgray;
    border-radius: 5px 0 0 5px;
    padding-left: 15px;
    box-sizing: border-box;

    @media (max-width: 768px) {
      height: 40px;
      font-size: 14px;
    }

    @media (max-width: 480px) {
      height: 35px;
      font-size: 12px;
    }
  }

  & input:hover {
    border-color: #1A6D89;
  }

  & ::placeholder {
    color: lightgray;

    @media (max-width: 480px) {
      font-size: 12px;
    }
  }

  & button {
    height: 45px;
    font-size: 25px;
    background-color: #DEECF0;
    border: 1px solid lightgray;
    border-left: none;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 15px;

    @media (max-width: 768px) {
      height: 40px;
      font-size: 20px;
    }

    @media (max-width: 480px) {
      height: 35px;
      font-size: 18px;
    }
  }

  & button:hover {
    background-color: #1A6D89;
    color: white;
  }
`;

interface SearchbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ searchQuery, setSearchQuery, handleSearch }) => {
  return (
    <SearchBarContainer onSubmit={handleSearch}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          console.log('Search input changed:', e.target.value);
          setSearchQuery(e.target.value);
        }}
        placeholder="검색어를 입력하세요"
      />
      <button type="submit"><FaSearch /></button>
    </SearchBarContainer>
  );
};

export default Searchbar;
