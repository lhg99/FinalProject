import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { BoardProps } from '../../types';
// import { toggleLike as apiToggleLike } from './api/boardAPI';

const Table = styled.table`
  width: 100%;
  max-width: 1100px;
  margin: 0px auto;
  padding: 0 20px;
  border-collapse: collapse;
  font-family: 'Arial', sans-serif;
`;

const TableHeader = styled.th`
  border-top: 1px solid #000;
  padding: 18px;
  background-color: #DEECF0;
  color: #000;
`;

const TableRow = styled.tr`
  &:nth-child {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #E7F0F1;
  }
`;

const TableCell = styled.td`
  border-bottom: 1px solid #ddd;
  padding: 12px;
  text-align: center;
  color: #000;
`;

const TitleCell = styled(TableCell)`
  cursor: pointer;
  color: #000;
`;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

const categoryMap: { [key: string]: string } = {
  WORKOUT: '운동',
  AD: '광고',
  CONCERN: '상담',
  HOBBY: '취미',
  NEIGHBOR: '동네',
  ETC: '기타'
};

const BoardList: React.FC<BoardProps> = ({ posts, setPosts }) => {
  const navigate = useNavigate();


  return (
    <div>
      <Table>
        <thead>
          <tr>
            <TableHeader style={{ width: '30px' }}>번호</TableHeader>
            <TableHeader style={{ width: '30px' }}>카테고리</TableHeader>
            <TableHeader style={{ width: '200px' }}>제목</TableHeader>
            <TableHeader style={{ width: '30px' }}>작성자</TableHeader>
            <TableHeader style={{ width: '30px' }}>작성일</TableHeader>
            {/* <TableHeader style={{ width: '60px' }}>좋아요</TableHeader> */}
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <TableRow key={post.boardId}>
              <TableCell>{post.boardId}</TableCell>
              <TableCell>{categoryMap[post.boardCategory] || post.boardCategory}</TableCell>
              <TitleCell onClick={() => navigate(`/Board/free/post/${post.boardId}`)}>{post.boardTitle}</TitleCell>
              <TableCell>{post.writer}</TableCell>
              <TableCell>{formatDate(post.boardRegDate)}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BoardList;
