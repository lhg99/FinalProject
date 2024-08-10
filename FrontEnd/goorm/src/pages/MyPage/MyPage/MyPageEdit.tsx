import React, { useState, useEffect } from "react";
import styles from "./MyPage.module.scss";
import { ChangeData, postChangeData } from '../../../api/mypageApi';
import { useNavigate } from 'react-router-dom';

interface MyPageEditProps {
  initialUsername: string;
  initialComment: string;
  onUpdate: () => void;
}

const MyPageEdit: React.FC<MyPageEditProps> = ({
  initialUsername,
  initialComment,
  onUpdate
}) => {
  const [username, setUsername] = useState<string>(initialUsername);
  const [comment, setComment] = useState<string>(initialComment);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Reset state if initial values change
    setUsername(initialUsername);
    setComment(initialComment);
  }, [initialUsername, initialComment]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedData: ChangeData = {
      username,
      comment
    };

    try {
      await postChangeData(updatedData);
      navigate('/mypage', { state: { updated: true } });
    } catch (err) {
      setError('회원 정보 수정에 실패하였습니다.');
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>회원정보 수정</h2>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleUpdate} className={styles.editForm}>
        <div className={styles['form-group']}>
          <label htmlFor="username">닉네임</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username} // Ensure input reflects state
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="comment">소개</label>
          <textarea
            id="comment"
            name="comment"
            value={comment} // Ensure textarea reflects state
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>

        <button className={styles.button} type="submit">수정사항 저장</button>
      </form>
    </div>
  );
};

export default MyPageEdit;