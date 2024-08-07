import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BoardList from './BoardList';
import Pagination from '../../components/Pagination';
import Searchbar from '../../components/SearchBar';
import { BoardDetails } from '../../types';
import { fetchPosts } from '../../api/boardAPI';
import Boardtabs from '../../../../components/Taps/BoardTap/BoardTabs';

const Container = styled.div`
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FreeBoardPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>('FREE');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);  
  const [currentPosts, setCurrentPosts] = useState<BoardDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const paginate = (pageNumber: number) => {
    console.log('Paginate:', pageNumber); 
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching posts with:', {
          selectedTab,
          currentPage,
          searchQuery,
        });
        const data = await fetchPosts(selectedTab, currentPage - 1, searchQuery);
        setCurrentPosts(data.boardItems);
        setTotalPages(data.totalPages);  

        console.log('Total Pages:', data.totalPages);
        console.log('Total Posts:', data.totalCnt);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    console.log('Fetching posts:', selectedTab, currentPage, searchQuery);
    fetchData();
  }, [selectedTab, currentPage, searchQuery]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Search submitted with query:', searchQuery);
    setCurrentPage(1);
  };

  return (
    <Container>
      <Boardtabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <BoardList
        boardType={selectedTab}
        currentPage={currentPage}
        postsPerPage={postsPerPage}
        posts={currentPosts}
        setPosts={setCurrentPosts}
      />
      <Pagination
        totalPages={totalPages}  
        currentPage={currentPage}
        paginate={paginate}
      />
      <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} />
    </Container>
  );
};

export default FreeBoardPage;
