import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FreeBoardPage.module.scss';
import { BoardDetails, BoardType } from '../../types';
import { fetchPosts } from '../../api/boardAPI';
import BoardTabs from '../../../../components/Taps/BoardTap/BoardTabs';
import Pagination from '../../components/Pagination';
import Searchbar from '../../components/SearchBar';

const categoryMap: { [key: string]: string } = {
  WORKOUT: '운동',
  AD: '광고',
  CONCERN: '상담',
  HOBBY: '취미',
  NEIGHBOR: '동네',
  ETC: '기타',
};

const FreeBoardPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<BoardType>(BoardType.FREE);  // 타입을 BoardType으로 설정
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPosts, setCurrentPosts] = useState<BoardDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPosts(BoardType.FREE, currentPage - 1, searchQuery); // selectedTab 대신 BoardType.FREE 사용
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
            <th className={styles.tableHeader} style={{ width: '30px' }}>번호</th>
            <th className={styles.tableHeader} style={{ width: '30px' }}>카테고리</th>
            <th className={styles.tableHeader} style={{ width: '200px' }}>제목</th>
            <th className={styles.tableHeader} style={{ width: '30px' }}>작성자</th>
            <th className={styles.tableHeader} style={{ width: '30px' }}>작성일</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post, index) => (
            <tr key={post.boardId} className={styles.tableRow}>
              <td className={styles.tableCell}>
              {totalPages - (currentPage - 1) * postsPerPage - index}
              </td>              
              <td className={styles.tableCell}>{categoryMap[post.boardCategory] || post.boardCategory}</td>
              <td className={styles.titleCell} onClick={() => navigate(`/Board/free/post/${post.boardId}`)}>
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

export default FreeBoardPage;
