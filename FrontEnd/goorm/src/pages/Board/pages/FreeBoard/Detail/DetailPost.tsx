import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { BoardDetails, BoardType } from '../../../types';
import { fetchPostDetail, deletePost, toggleLike as apiToggleLike } from '../../../api/boardAPI';
import styles from './DetailPost.module.scss';
import CommentSection from '../../../Comment/CommentSection';
import Tabs from '../../../../../components/Taps/BoardTap/BoardTabs';
import { ReportModal, DeleteModal, DeleteCommentModal } from '../../../components/Modal';
import LikeButton from '../../../components/LikeButton';
import ExerciseRecordList from '../../ExerciseBoard/DetailList/ExerciseRecordList';
import ChatBox from '../../../Chat/ChatBox';


const DetailPost: React.FC = () => {
  const { id, tab } = useParams<{ id?: string, tab?: BoardType }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState<BoardDetails | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCnt, setLikesCnt] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState<BoardType>(tab || BoardType.FREE);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalAction, setModalAction] = useState<() => void>(() => { });
  const [showChatBox, setShowChatBox] = useState(false);
  const [chatBoxPosition, setChatBoxPosition] = useState<{ x: number, y: number } | null>(null);
  const [chatAuthor, setChatAuthor] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const fetchPost = async () => {
      try {
        const data = await fetchPostDetail(id);
        if (data) {
          setPost(data);
          setIsLiked(data.likes);
          setLikesCnt(data.likesCnt);
          setSelectedTab(data.boardType as BoardType);
        } else {
          console.error('게시글을 불러오는 중 오류가 발생했습니다');
          navigate('/');
        }
      } catch (error) {
        console.error('게시글을 불러오는 중 오류가 발생했습니다', error);
        navigate('/');
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleTabChange = (newTab: BoardType) => {
    setSelectedTab(newTab);
    navigate(`/Board/${newTab.toLowerCase()}/post/${id}`);
  };

  const handleLikeToggle = async (boardId: number) => {
    if (!post) return;

    try {
      await apiToggleLike(boardId);
      setIsLiked(!isLiked);
      setLikesCnt(prevLikesCnt => isLiked ? prevLikesCnt - 1 : prevLikesCnt + 1);
    } catch (error) {
      console.error('좋아요 토글 중 오류가 발생했습니다', error);
    }
  };

  const handleDelete = async () => {
    if (id) {
      setModalMessage('게시글을 삭제하시겠습니까?');
      setModalAction(() => async () => {
        try {
          await deletePost(id);
          setModalMessage('게시글이 성공적으로 삭제되었습니다.');
          setModalAction(() => () => navigate(`/Board/${selectedTab.toLowerCase()}`));
          setShowDeleteModal(true);
        } catch (error) {
          console.error('게시글 삭제 중 오류가 발생했습니다', error);
          setModalMessage('게시글 삭제 중 오류가 발생했습니다.');
          setModalAction(() => closeDeleteModal);
        }
      });
      setShowDeleteModal(true);
    }
  };

  const handleEdit = () => {
    if (id) {
      navigate(`/Board/${selectedTab.toLowerCase()}/post/edit/${id}`);
    }
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

  const confirmReport = () => {
    setModalMessage('신고가 접수되었습니다.');
    setModalAction(() => closeReportModal);
    setShowReportModal(false);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const closeDeleteCommentModal = () => {
    setShowDeleteCommentModal(false);
  };

  const handleAuthorClick = (event: React.MouseEvent, author: string) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const gap = 0; 
    setChatBoxPosition({ x: rect.left, y: rect.bottom + scrollY + gap });
    setChatAuthor(author);
    setShowChatBox(prevShowChatBox => !prevShowChatBox); 
  };
  
  const handleCloseChatBox = () => {
    setShowChatBox(false);
    setChatAuthor(null);
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <div className={styles.Container}>
      <div className={styles.DetailContainer}>
        <Tabs selectedTab={selectedTab} setSelectedTab={handleTabChange} />
        <div className={styles.Header}>
        <div className={styles.PostHeader}>
            <h1 className={styles.PostTitle}>{post.boardTitle}</h1>
            <div className={styles.PostMeta}>
            <span
                className={styles.Author}
                onClick={(e) => handleAuthorClick(e, post.writer)} // 닉네임 클릭 시 ChatBox 열기
              >
                {post.writer}
              </span>
              <span>작성일 : {post.boardRegDate}</span>
              <span>
                <LikeButton 
                  boardId={post.boardId} 
                  isLiked={isLiked} 
                  likesCnt={likesCnt} 
                  toggleLike={handleLikeToggle} 
                  reportsCnt={post.viewCnt}
                />
              </span>
            </div>
        </div>
        <div className={styles.PostContent}>
          <div dangerouslySetInnerHTML={{ __html: post.boardContent }} />
        </div>
        <ExerciseRecordList records={post.trainingRecordItems} /> {/* 운동 기록 리스트 추가 */}
        <CommentSection postId={post.boardId} setShowDeleteCommentModal={setShowDeleteCommentModal} setModalMessage={setModalMessage} setModalAction={setModalAction} />
        <div className={styles.ButtonContainer}>
          <button className={styles.EditButton} onClick={handleEdit}>수정</button>
          <button className={styles.DeleteButton} onClick={handleDelete}>삭제</button>
          <button className={styles.ReportButton} onClick={handleReport}>신고</button>
          </div></div>
      </div></div>

      {showReportModal && <ReportModal confirmReport={confirmReport} closeReportModal={closeReportModal} />}
      {showDeleteModal && <DeleteModal modalMessage={modalMessage} modalAction={modalAction} closeDeleteModal={closeDeleteModal} />}
      {showDeleteCommentModal && <DeleteCommentModal modalMessage={modalMessage} modalAction={modalAction} closeDeleteCommentModal={closeDeleteCommentModal} />}
      {showChatBox && chatBoxPosition && chatAuthor && (
        <ChatBox
          x={chatBoxPosition.x}
          y={chatBoxPosition.y}
          author={chatAuthor}
          onClose={handleCloseChatBox}
        />
      )}
    </>
  );
};

export default DetailPost;