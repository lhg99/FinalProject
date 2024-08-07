import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostDetail, updatePost } from '../api/boardAPI';
import { BoardDetails } from '../types';
import Category from '../components/Category';
import TextEditor from '../../../components/TextEditor/TextEditor';
import styles from './UpdatePost.module.scss';

const UpdatePost: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [boardType, setBoardType] = useState<string>('FREE');
  const [boardCategory, setBoardCategory] = useState<string>('WORKOUT');
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const data: BoardDetails = await fetchPostDetail(id);
          setTitle(data.boardTitle);
          setContent(data.boardContent);
          setBoardType(data.boardType);
          setBoardCategory(data.boardCategory);
          setExistingImages(data.imageUrls || []);
        } catch (error) {
          console.error('게시글을 불러오는 중 오류가 발생했습니다', error);
          alert('게시글을 불러오는 중 오류가 발생했습니다');
          navigate('/');
        }
      };

      fetchPost();
    }
  }, [id, navigate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (data: string) => {
    setContent(data);
  };

  const handleBoardTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBoardType(e.target.value);
  };

  const handleBoardCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBoardCategory(e.target.value);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !boardType.trim() || !boardCategory.trim()) {
      alert('모든 필수 입력 필드를 입력해주세요.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('boardId', id!);
      formData.append('boardTitle', title);
      formData.append('boardContent', content);
      formData.append('boardType', boardType);
      formData.append('boardCategory', boardCategory);

      if (existingImages.length > 0) {
        formData.append('existingImages', JSON.stringify(existingImages));
      }

      await updatePost(formData);
      alert('게시글이 성공적으로 수정되었습니다.');
      navigate(`/Board/free/post/${id}`);
    } catch (error) {
      alert('게시글 수정 중 오류가 발생했습니다.');
      console.error('게시글 수정 중 오류가 발생했습니다:', (error as any).response?.data || (error as Error).message);
    }
  };

  const handleCancel = () => {
    navigate(`/Board/free/post/${id}`);
  };

  return (
    <div className={styles.postContainer}>
      <h2>게시글 수정</h2>
      <form onSubmit={handleSave}>
        <Category 
          boardType={boardType} 
          boardCategory={boardCategory} 
          handleBoardTypeChange={handleBoardTypeChange} 
          handleBoardCategoryChange={handleBoardCategoryChange}
        />
        <input 
          type='text' 
          placeholder='제목' 
          value={title} 
          onChange={handleTitleChange} 
          required
        />
        <TextEditor 
          defaultValue={content} 
          onChange={handleContentChange} 
        />
        {/*
        <input 
          type="file" 
          multiple 
          onChange={handleImageChange} 
        />
        */}
        {existingImages.length > 0 && (
          <div className={styles.existingImages}>
            {existingImages.map((url, index) => (
              <img key={index} src={url} alt={`existing_image_${index}`} className={styles.PostImage} />
            ))}
          </div>
        )}
        <div className={styles.buttonGroup}>
          <button type="button" className={styles.backButton} onClick={handleCancel}>수정 취소</button>
          <button type="submit" className={styles.submitButton}>수정 완료</button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePost;
