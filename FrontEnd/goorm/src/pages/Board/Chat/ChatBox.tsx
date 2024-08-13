import React, { useEffect, useRef } from 'react';
import styles from './ChatBox.module.scss';
import { inviteChat } from '../../Chat/api/chatApi';

interface ChatBoxProps {
  x: number;
  y: number;
  author: string; // 추가된 부분: 작성자 이름 prop
  onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ x, y, author, onClose }) => {
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const callInviteChat = async (receiver: string) => {

    try {
      const data = await inviteChat(receiver)
      alert(data)
    } catch (error) {
      console.log (receiver ,"채팅신청오류")
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleChatRequest = () => {
    callInviteChat(author)
    console.log(`채팅 신청을 보냅니다: ${author}`);
    onClose();
  };

  const handleFriendRequest = () => {
    console.log(`친구 추가를 보냅니다: ${author}`);
    onClose();
  };

  return (
    <div className={styles.chatBox} style={{ top: y, left: x }} ref={chatBoxRef}>
      <div className={styles.chatBoxContent}>
        <button className={styles.chatButton} onClick={handleChatRequest}>채팅 신청</button>
        <button className={styles.friendButton} onClick={handleFriendRequest}>친구 추가</button>
      </div>
    </div>
  );
};

export default ChatBox;