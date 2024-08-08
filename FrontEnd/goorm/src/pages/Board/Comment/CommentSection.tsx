import React, { useState, useEffect, FormEvent, Dispatch, SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './CommentSection.module.scss';
import { fetchComments, addComment, deleteComment, updateComment } from '../api/boardAPI';
import { Comment } from '../types';
import CommentTextEditor from './CommentTextEditor';
import { DeleteCommentModal } from '../components/Modal';

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
  const [showDeleteCommentModal, setShowDeleteCommentModalState] = useState(false); // 새로운 상태 추가

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
        console.log('Deleting comment with ID:', commentToDelete); // 디버깅 로그 추가
        await deleteComment(commentToDelete.toString());
        setComments(comments.filter(comment => comment.commentId !== commentToDelete));
        setCommentToDelete(null);
        setShowDeleteCommentModalState(false); // 모달 닫기
      } catch (error) {
        console.error('댓글 삭제 중 오류가 발생했습니다.', error);
      }
    }
  };

  const openModal = (commentId: number) => {
    setCommentToDelete(commentId);
    setModalMessage('댓글을 삭제하시겠습니까?');
    setModalAction(() => confirmDeleteComment);
    setShowDeleteCommentModalState(true); // 모달 열기
  };

  const closeModal = () => {
    setCommentToDelete(null);
    setShowDeleteCommentModalState(false); // 모달 닫기
  };

  const startEditingComment = (commentId: number, commentContent: string) => {
    setEditCommentId(commentId);
    setEditCommentContent(commentContent);
  };

  const cancelEditing = () => {
    setEditCommentId(null);
    setEditCommentContent('');
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
        {comments.map(comment => (
          <li key={comment.commentId} className={styles.commentItem}>
            <div className={styles.commentHeader}>
              <div className={styles.userIcon}>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <span className={styles.commentAuthor}>{comment.writer}</span>
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
                      <button
                        className={`${styles.editButton} ${styles.button}`}
                        onClick={() => startEditingComment(comment.commentId, comment.commentContent)}
                      >
                        수정
                      </button>
                      <button
                        className={`${styles.deleteButton} ${styles.button}`}
                        onClick={() => openModal(comment.commentId)}
                      >
                        삭제
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
    </div>
  );
};

export default CommentSection;
