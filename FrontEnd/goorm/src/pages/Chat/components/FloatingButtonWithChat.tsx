import React, { useState, useEffect, useRef } from 'react';
import './FloatingButtonWithChat.scss'; // 스타일 파일을 추가

const FloatingButtonWithChat: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [inChatRoom, setInChatRoom] = useState(false);
  const [currentChatRoomName, setCurrentChatRoomName] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (isChatOpen) {
      setInChatRoom(false); // 채팅창이 닫힐 때 채팅방 상태 초기화
    }
  };

  const enterChatRoom = (chatRoomName: string) => {
    setCurrentChatRoomName(chatRoomName);
    setInChatRoom(true);
    setMessages(prevMessages => [
      ...prevMessages,
      { type: 'system', content: `${chatRoomName}에 입장했습니다.`, timestamp: new Date().toLocaleTimeString(), unreadCount: 0 }
    ]);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  };

  useEffect(() => {
    if (inChatRoom) {
      scrollToBottom();
    }
  }, [inChatRoom]);

  useEffect(() => {
    // STOMP connection setup and message handling here
    // Example:
    // stompClient.connect({}, frame => {
    //   stompClient.subscribe('/topic/messages', message => {
    //     const newMessage = JSON.parse(message.body);
    //     setMessages(prevMessages => [...prevMessages, newMessage]);
    //     scrollToBottom();
    //   });
    // });
  }, []);

  const renderChatRoomList = () => (
    <ul className="chat-room-list">
      <li onClick={() => enterChatRoom('채팅방 1')}>
        <img src="https://via.placeholder.com/40" alt="Chat Room" className="chat-room-image" />
        <div className="chat-room-info">
          <div className="chat-room-name">채팅방 1</div>
          <div className="chat-room-last-message">마지막 메시지 내용</div>
        </div>
      </li>
      <li onClick={() => enterChatRoom('채팅방 2')}>
        <img src="https://via.placeholder.com/40" alt="Chat Room" className="chat-room-image" />
        <div className="chat-room-info">
          <div className="chat-room-name">채팅방 2</div>
          <div className="chat-room-last-message">마지막 메시지 내용</div>
        </div>
      </li>
      <li onClick={() => enterChatRoom('채팅방 3')}>
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
      <li onClick={() => enterChatRoom('오픈채팅방 1')}>
        <img src="https://via.placeholder.com/40" alt="Open Chat Room" className="chat-room-image" />
        <div className="chat-room-info">
          <div className="chat-room-name">오픈채팅방 1</div>
          <div className="chat-room-last-message">마지막 메시지 내용</div>
        </div>
      </li>
      <li onClick={() => enterChatRoom('오픈채팅방 2')}>
        <img src="https://via.placeholder.com/40" alt="Open Chat Room" className="chat-room-image" />
        <div className="chat-room-info">
          <div className="chat-room-name">오픈채팅방 2</div>
          <div className="chat-room-last-message">마지막 메시지 내용</div>
        </div>
      </li>
      <li onClick={() => enterChatRoom('오픈채팅방 3')}>
        <img src="https://via.placeholder.com/40" alt="Open Chat Room" className="chat-room-image" />
        <div className="chat-room-info">
          <div className="chat-room-name">오픈채팅방 3</div>
          <div className="chat-room-last-message">마지막 메시지 내용</div>
        </div>
      </li>
    </ul>
  );

  const generateSampleMessages = () => {
    const messages = [];
    for (let i = 1; i <= 30; i++) {
      messages.push(
        <div className={`chat-message ${i % 2 === 0 ? 'right' : 'left'}`} key={i}>
          {i % 2 === 0 && (
            <div className="message-info">
              <span className="unread-count">0</span>
              <span className="message-time">{new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}</span>
            </div>
          )}

          <div className="message-content">
            {i % 2 === 0 ? `내가 보낸 메시지 ${i}` : `상대방이 보낸 메시지 ${i}`}
          </div>

          {i % 2 !== 0 && (
            <div className="message-info">
              <span className="unread-count">2</span>
              <span className="message-time">{new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}</span>
            </div>
          )}
        </div>
      );
    }
    return messages;
  };
  
  const renderChatMessages = () => (
    <div className="chat-messages">
      {generateSampleMessages()}
      {messages.map((message, index) => (
        <div key={index} className={`chat-message ${message.type === 'system' ? 'system' : message.type === 'right' ? 'right' : 'left'}`}>
          {message.type === 'right' && (
            <div className="message-info">
              <span className="unread-count">{message.unreadCount}명</span>
              <span className="message-time">{new Date(message.timestamp).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}</span>
            </div>
          )}
          <div className="message-content">
            {message.content}
          </div>
          {message.type !== 'system' && message.type === 'left' && (
            <div className="message-info">
              <span className="unread-count">{message.unreadCount}명</span>
              <span className="message-time">{new Date(message.timestamp).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}</span>
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
  
  
  
  
  const renderChatRoomHeader = () => (
    <div className="chat-room-header">
      <button className="back-button" onClick={() => setInChatRoom(false)}>〈</button>
      <h2>{currentChatRoomName}</h2>
      <div className="header-spacer"></div>
    </div>
  );

  const renderChatListHeader = () => (
    <div className="chat-list-header">
      <h2>{activeTab === 'home' ? '홈' : activeTab === 'chat' ? '채팅' : '오픈채팅'}</h2>
      <button onClick={toggleChat} className="close-button">×</button>
    </div>
  );

  const renderContent = () => {
    if (inChatRoom) {
      return (
        <div className="chat-room">
          {renderChatMessages()}
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
          {inChatRoom ? renderChatRoomHeader() : renderChatListHeader()}
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
