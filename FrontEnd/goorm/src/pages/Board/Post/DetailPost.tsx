import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { BoardDetails } from '../types';
import { fetchPostDetail, deletePost, toggleLike as apiToggleLike } from '../api/boardAPI';
import styles from './DetailPost.module.scss';
import CommentSection from '../Comment/CommentSection';
import Tabs from '../../../components/Taps/BoardTap/BoardTabs';
import { ReportModal, DeleteModal, DeleteCommentModal } from '../components/Modal';
import LikeButton from '../components/LikeButton';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

const DetailPost: React.FC = () => {
  const { id, tab } = useParams<{ id?: string, tab?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState<BoardDetails | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCnt, setLikesCnt] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState<string>(tab || 'free');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalAction, setModalAction] = useState<() => void>(() => { });

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
          setSelectedTab(data.boardType.toLowerCase());
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

  const handleTabChange = (newTab: string) => {
    setSelectedTab(newTab);
    navigate(`/Board/free/post/${id}/${newTab}`);
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
          setModalAction(() => () => navigate('/Board/free'));
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
      navigate(`/Board/free/post/edit/${id}`);
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

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={styles.DetailContainer}>
        <Tabs selectedTab={selectedTab} setSelectedTab={handleTabChange} />
        <div className={styles.PostHeader}>
          <h1 className={styles.PostTitle}>{post.boardTitle}</h1>
          <div className={styles.PostMeta}>
            <span>작성자 : {post.writer}</span>
            <span>작성일 : {formatDate(post.boardRegDate)}</span>
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
          {/* {post.imageUrls && post.imageUrls.length > 0 && (
            <div className={styles.ImageContainer}>
              {post.imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`post_image_${index}`} className={styles.PostImage} /> */}
              {/* ))} */}
            {/* </div> */}
          {/* )} */}
        </div>
        <CommentSection postId={post.boardId} setShowDeleteCommentModal={setShowDeleteCommentModal} setModalMessage={setModalMessage} setModalAction={setModalAction} />
        <div className={styles.ButtonContainer}>
          <button className={styles.EditButton} onClick={handleEdit}>수정</button>
          <button className={styles.DeleteButton} onClick={handleDelete}>삭제</button>
          <button className={styles.ReportButton} onClick={handleReport}>신고</button>
        </div>
      </div>

      {showReportModal && <ReportModal confirmReport={confirmReport} closeReportModal={closeReportModal} />}
      {showDeleteModal && <DeleteModal modalMessage={modalMessage} modalAction={modalAction} closeDeleteModal={closeDeleteModal} />}
      {showDeleteCommentModal && <DeleteCommentModal modalMessage={modalMessage} modalAction={modalAction} closeDeleteCommentModal={closeDeleteCommentModal} />}
    </>
  );
};

export default DetailPost;
