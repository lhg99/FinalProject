import React, { useState } from 'react';
import './FloatingButtonWithChat.scss'; // 스타일 파일을 추가

const FloatingButtonWithChat: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [inChatRoom, setInChatRoom] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (isChatOpen) {
      setInChatRoom(false); // 채팅창이 닫힐 때 채팅방 상태 초기화
    }
  };

  const renderChatRoomList = () => (
    <ul className="chat-room-list">
      <li onClick={() => setInChatRoom(true)}>
        <img src="https://via.placeholder.com/40" alt="Chat Room" className="chat-room-image" />
        <div className="chat-room-info">
          <div className="chat-room-name">채팅방 1</div>
          <div className="chat-room-last-message">마지막 메시지 내용</div>
        </div>
      </li>
      <li onClick={() => setInChatRoom(true)}>
        <img src="https://via.placeholder.com/40" alt="Chat Room" className="chat-room-image" />
        <div className="chat-room-info">
          <div className="chat-room-name">채팅방 2</div>
          <div className="chat-room-last-message">마지막 메시지 내용</div>
        </div>
      </li>
      <li onClick={() => setInChatRoom(true)}>
        <img src="https://via.placeholder.com/40" alt="Chat Room" className="chat-room-image" />
        <div className="chat-room-info">
          <div className="chat-room-name">채팅방 3</div>
          <div className="chat-room-last-message">마지막 메시지 내용</div>
        </div>
      </li>
    </ul>
  );

  const renderOpenChatRoomList = () => (
    <ul className="chat-room-list">
      <li onClick={() => setInChatRoom(true)}>
        <img src="https://via.placeholder.com/40" alt="Open Chat Room" className="chat-room-image" />
        <div className="chat-room-info">
          <div className="chat-room-name">오픈채팅방 1</div>
          <div className="chat-room-last-message">마지막 메시지 내용</div>
        </div>
      </li>
      <li onClick={() => setInChatRoom(true)}>
        <img src="https://via.placeholder.com/40" alt="Open Chat Room" className="chat-room-image" />
        <div className="chat-room-info">
          <div className="chat-room-name">오픈채팅방 2</div>
          <div className="chat-room-last-message">마지막 메시지 내용</div>
        </div>
      </li>
      <li onClick={() => setInChatRoom(true)}>
        <img src="https://via.placeholder.com/40" alt="Open Chat Room" className="chat-room-image" />
        <div className="chat-room-info">
          <div className="chat-room-name">오픈채팅방 3</div>
          <div className="chat-room-last-message">마지막 메시지 내용</div>
        </div>
      </li>
    </ul>
  );

  const renderContent = () => {
    if (inChatRoom) {
      return (
        <div className="chat-room">
          <button className="back-button" onClick={() => setInChatRoom(false)}>〈</button>
          <div className="chat-messages">
            {/* 채팅 내용 */}
          </div>
          <div className="chat-footer">
            <input type="text" placeholder="메시지를 입력하세요" />
            <button>전송</button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return <div className="chat-body">홈 화면</div>;
      case 'chat':
        return <div className="chat-body">{renderChatRoomList()}</div>;
      case 'openChat':
        return <div className="chat-body">{renderOpenChatRoomList()}</div>;
      default:
        return null;
    }
  };

  return (
    <div>
      <button className="floating-button" onClick={toggleChat}>
        채팅
      </button>
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h2>{inChatRoom ? '' : activeTab === 'home' ? '홈' : activeTab === 'chat' ? '채팅' : '오픈채팅'}</h2>
            <button onClick={toggleChat} className="close-button">×</button>
          </div>
          {renderContent()}
          {!inChatRoom && (
            <nav className="chat-nav">
              <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'active' : ''}>홈</button>
              <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'active' : ''}>채팅</button>
              <button onClick={() => setActiveTab('openChat')} className={activeTab === 'openChat' ? 'active' : ''}>오픈채팅</button>
            </nav>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingButtonWithChat;
