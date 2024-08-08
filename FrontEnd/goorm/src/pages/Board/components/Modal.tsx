import React from 'react';
import styles from './Modal.module.scss';

// 신고 모달 
export const ReportModal: React.FC<{ confirmReport: () => void; closeReportModal: () => void }> = ({ confirmReport, closeReportModal }) => (
  <div className={styles.ModalOverlay}>
    <div className={styles.Modal}>
      <p>신고를 접수하시겠습니까?</p>
      <div className={styles.ModalButtons}>
        <button onClick={confirmReport} className={styles.ConfirmButton}>신고</button>
        <button onClick={closeReportModal} className={styles.CancelButton}>취소</button>
      </div>
    </div>
  </div>
);

// 삭제 모달 
export const DeleteModal: React.FC<{ modalMessage: string; modalAction: () => void; closeDeleteModal: () => void }> = ({ modalMessage, modalAction, closeDeleteModal }) => (
  <div className={styles.ModalOverlay}>
    <div className={styles.Modal}>
      <p>{modalMessage}</p>
      <div className={`${styles.ModalButtons} ${modalMessage === '게시글이 성공적으로 삭제되었습니다.' ? styles.SingleButton : ''}`}>
        {modalMessage === '게시글이 성공적으로 삭제되었습니다.' ? (
          <button onClick={modalAction} className={styles.ConfirmButton}>확인</button>
        ) : (
          <>
            <button onClick={modalAction} className={styles.ConfirmButton}>삭제</button>
            <button onClick={closeDeleteModal} className={styles.CancelButton}>취소</button>
          </>
        )}
      </div>
    </div>
  </div>
);

// 댓글 삭제 모달 
export const DeleteCommentModal: React.FC<{ modalMessage: string; modalAction: () => void; closeDeleteCommentModal: () => void }> = ({ modalMessage, modalAction, closeDeleteCommentModal }) => (
  <div className={styles.ModalOverlay}>
    <div className={styles.Modal}>
      <p>{modalMessage}</p>
      <div className={styles.ModalButtons}>
        <button onClick={modalAction} className={styles.ConfirmButton}>확인</button>
        <button onClick={closeDeleteCommentModal} className={styles.CancelButton}>취소</button>
      </div>
    </div>
  </div>
);
