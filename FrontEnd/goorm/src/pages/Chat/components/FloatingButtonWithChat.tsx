import React, { useState, useEffect, useRef } from 'react';
import './FloatingButtonWithChat.scss'; // 스타일 파일을 추가
import { getChatRoomsByMember } from './api/chatApi';

const FloatingButtonWithChat: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [inChatRoom, setInChatRoom] = useState<boolean>(false);
  const [currentChatRoomName, setCurrentChatRoomName] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [chatRooms, setChatRooms] = useState<any[]>([]);  // 추가: 채팅방 목록 상태
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    getChatRoomsByMember("user1");
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

  //채팅방 목록 가져오는 useEffect()
  useEffect(() => {
    if (activeTab === 'chat') {
      const fetchChatRooms = async () => {
        try {
          const data = await getChatRoomsByMember('user1'); // user1 임시데이터
          setChatRooms(data);
          console.log(data)
        } catch (error) {
          console.error('참여한 채팅방 불러오기 오류');
        }
      };

      fetchChatRooms();
    }
  }, [activeTab]);

  const renderChatRoomList = () => (
    <ul className="chat-room-list">
      {chatRooms.map((chatRoom) => (
        <li key={chatRoom.chatRoomId} onClick={() => enterChatRoom(chatRoom.chatRoomName)}>
          <img src="https://via.placeholder.com/40" alt="Chat Room" className="chat-room-image" />
          <div className="chat-room-info">
            <div className="chat-room-name">{chatRoom.chatRoomName}</div>
            <div className="chat-room-last-message">샘플 메시지</div>
          </div>
        </li>
      ))}
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
    </ul>
  );

  const generateSampleMessages = () => {
    const messages = [];
    for (let i = 1; i <= 30; i++) {
      messages.push(
        <div className={`chat-message ${i % 2 === 0 ? 'right' : 'left'}`} key={i}>
          {i % 2 === 0 && (
            <div className="message-info">
              <span className="unread-count">1</span>
              <span className="message-time">{new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}</span>
            </div>
          )}

          {i % 2 === 0 && (
            <div className='message-content'>
              {`내가 보낸 메시지 내가보낸메시지ㄻㅇㄴㄻㅇㄴ${i}`}
            </div>
          )}          
          
          {i % 2 !== 0 && (
            <div>
              <div className='message-username'>
                <span className='sendername'>상대방 닉네임</span>
              </div>              
              <div className='message-content'>
                {`내가 보낸 메시지 내가보낸메시지${i}`}
              </div>
            </div>
          )}

          {i % 2 !== 0 && (
            <div className="message-info">
              <span className="unread-count">0</span>
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
        <div key={index} className={`chat-message ${message.type === 'system' ? 'system' : null}`}>
          <div className="message-content">
            {message.content}
          </div>
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
