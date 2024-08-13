import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DietBoardPage.module.scss';
import { BoardDetails, BoardType } from '../../../types';
import BoardTabs from '../../../../../components/Taps/BoardTap/BoardTabs';
import Pagination from '../../../components/Pagination';
import Searchbar from '../../../components/SearchBar';
import { fetchPosts } from '../../../api/boardAPI';  // fetchPosts 함수 사용

const categoryMap: { [key: string]: string } = {
  DIET: '식단',
  AD: '광고',
  CONCERN: '상담',
  HOBBY: '취미',
  NEIGHBOR: '동네',
  ETC: '기타',
};

const DietBoardPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<BoardType>(BoardType.DIET); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPosts, setCurrentPosts] = useState<BoardDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const postsPerPage = 10; // 한 페이지에 표시할 게시글 수

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching posts for tab: ${selectedTab}, page: ${currentPage}, searchQuery: ${searchQuery}`); 
        const data = await fetchPosts(selectedTab, currentPage - 1, searchQuery);
        console.log('Fetched posts:', data); 
        setCurrentPosts(data.boardItems);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching posts:', error); 
      }
    };
    fetchData();
  }, [selectedTab, currentPage, searchQuery]);  

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <BoardTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} /> 
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader} style={{ width: '40px' }}>번호</th>
            <th className={styles.tableHeader} style={{ width: '20px' }}>카테고리</th>
            <th className={styles.tableHeader} style={{ width: '300px' }}>제목</th>
            <th className={styles.tableHeader} style={{ width: '30px' }}>작성자</th>
            <th className={styles.tableHeader} style={{ width: '30px' }}>작성일</th>
          </tr>
        </thead>
        <tbody>
        {currentPosts.map((post, index) => (
            <tr key={post.boardId} className={styles.tableRow}>
              <td className={styles.tableCell}>
              {index + 1 + (currentPage - 1) * postsPerPage}
              </td>
              <td className={styles.tableCell}>{categoryMap[post.boardCategory] || post.boardCategory}</td>
              <td className={styles.titleCell} onClick={() => navigate(`/Board/diet/post/${post.boardId}`)}>
                {post.boardTitle}
              </td>
              <td className={styles.tableCell}>{post.writer}</td>
              <td className={styles.tableCell}>{post.boardRegDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        paginate={paginate}
      />
      <Searchbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default DietBoardPage;
