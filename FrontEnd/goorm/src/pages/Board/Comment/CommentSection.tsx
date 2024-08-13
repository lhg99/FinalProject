import React, { useState, useEffect, FormEvent, Dispatch, SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './CommentSection.module.scss';
import { fetchComments, addComment, deleteComment, updateComment } from '../api/commentAPI';
import { Comment } from '../types';
import CommentTextEditor from './CommentTextEditor';
import { DeleteCommentModal } from '../components/Modal';
import ChatBox from '../Chat/ChatBox';

interface CommentSectionProps {
  postId: number;
  setShowDeleteCommentModal: Dispatch<SetStateAction<boolean>>;
  setModalMessage: Dispatch<SetStateAction<string>>;
  setModalAction: Dispatch<() => void>;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, setShowDeleteCommentModal, setModalMessage, setModalAction }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState<string>('');
  const [showDeleteCommentModal, setShowDeleteCommentModalState] = useState(false);

  // 추가된 상태
  const [showChatBox, setShowChatBox] = useState(false);
  const [chatBoxPosition, setChatBoxPosition] = useState({ x: 0, y: 0 });
  const [chatAuthor, setChatAuthor] = useState('');

  const loadComments = async () => {
    try {
      const fetchedComments = await fetchComments(postId.toString());
      setComments(fetchedComments);
    } catch (error) {
      console.error('댓글을 불러오는 중 오류가 발생했습니다.', error);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      console.error('댓글 내용을 입력해주세요.');
      return;
    }

    const newCommentData = {
      boardId: postId,
      commentContent: newComment,
      writer: '익명'
    };

    try {
      await addComment(newCommentData);
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('댓글 작성 중 오류가 발생했습니다.', error);
    }
  };

  const handleCommentUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editCommentId === null || !editCommentContent.trim()) {
      console.error('수정할 댓글 내용을 입력해주세요.');
      return;
    }

    const updatedCommentData = {
      commentId: editCommentId,
      commentContent: editCommentContent,
    };

    try {
      await updateComment(updatedCommentData);
      setEditCommentId(null);
      setEditCommentContent('');
      loadComments();
    } catch (error) {
      console.error('댓글 수정 중 오류가 발생했습니다.', error);
    }
  };

  const confirmDeleteComment = async () => {
    if (commentToDelete !== null) {
      try {
        console.log('Deleting comment with ID:', commentToDelete);
        await deleteComment(commentToDelete.toString());
        setComments(comments.filter(comment => comment.commentId !== commentToDelete));
        setCommentToDelete(null);
        setShowDeleteCommentModalState(false);
      } catch (error) {
        console.error('댓글 삭제 중 오류가 발생했습니다.', error);
      }
    }
  };

  const openModal = (commentId: number) => {
    setCommentToDelete(commentId);
    setModalMessage('댓글을 삭제하시겠습니까?');
    setModalAction(() => confirmDeleteComment);
    setShowDeleteCommentModalState(true);
  };

  const closeModal = () => {
    setCommentToDelete(null);
    setShowDeleteCommentModalState(false);
  };

  const startEditingComment = (commentId: number, commentContent: string) => {
    setEditCommentId(commentId);
    setEditCommentContent(commentContent);
  };

  const cancelEditing = () => {
    setEditCommentId(null);
    setEditCommentContent('');
  };

  // 닉네임 클릭 시 ChatBox를 여는 함수
  const handleAuthorClick = (event: React.MouseEvent, author: string) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const gap = 7; 
    setChatBoxPosition({ x: rect.left, y: rect.bottom + scrollY + gap }); 
    setChatAuthor(author);
    setShowChatBox((prev) => !prev); // Toggle the ChatBox visibility
  };
  

  return (
    <div className={styles.commentSection}>
      <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
        <div className={styles.inputContainer}>
          <div className={styles.commentInputWrapper}>
            <CommentTextEditor
              defaultValue={newComment}
              onChange={setNewComment}
            />
          </div>
            <button type="submit" className={styles.submitButton}>
            작성하기
            </button>
        </div>
      </form>
      <ul className={styles.commentList}>
      {[...comments].reverse().map(comment => (
          <li key={comment.commentId} className={styles.commentItem}>
            <div className={styles.commentHeader}>
              <div className={styles.userIcon}>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <span
                className={styles.commentAuthor}
                onClick={(e) => handleAuthorClick(e, comment.writer)} // 닉네임 클릭 시 ChatBox 열기
              >
                {comment.writer}
              </span>
              {editCommentId === comment.commentId ? (
                <form onSubmit={handleCommentUpdateSubmit} className={styles.editForm}>
                  <div className={styles.commentInputWrapper}>
                    <CommentTextEditor
                      defaultValue={editCommentContent}
                      onChange={setEditCommentContent}
                    />
                  </div>
                  <div className={styles.buttonGroup}>
                    <button type="submit" className={`${styles.saveButton} ${styles.button}`}>저장</button>
                    <button type="button" onClick={cancelEditing} className={`${styles.cancelButton} ${styles.button}`}>취소</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className={styles.commentContentWrapper}>
                    <span className={styles.commentContent} dangerouslySetInnerHTML={{ __html: comment.commentContent }} />
                  </div>
                  <div className={styles.rightAligned}>
                    <span className={styles.commentDate}>{comment.commentRegDate}</span>
                    <div className={styles.buttonGroup}>
                      <button className={`${styles.editButton} ${styles.button}`}
                        onClick={() => startEditingComment(comment.commentId, comment.commentContent)}
                      > 수정
                      </button>
                      <button className={`${styles.deleteButton} ${styles.button}`}
                        onClick={() => openModal(comment.commentId)}
                      > 삭제
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      {showDeleteCommentModal && commentToDelete !== null && (
        <DeleteCommentModal
          modalMessage='댓글을 삭제하시겠습니까?'
          modalAction={confirmDeleteComment}
          closeDeleteCommentModal={closeModal}
        />
      )}
      {showChatBox && (
        <ChatBox
          x={chatBoxPosition.x}
          y={chatBoxPosition.y}
          author={chatAuthor}
          onClose={() => setShowChatBox(false)}
        />
      )}
    </div>
  );
};

export default CommentSection;
