import React, { useState, useEffect, useRef } from 'react';
import './FloatingButtonWithChat.scss'; // 스타일 파일을 추가
import { getChatRoomsByMember, getChatHistory } from '../api/chatApi';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client'

const FloatingButtonWithChat: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [inChatRoom, setInChatRoom] = useState<boolean>(false);
  const [currentChatRoomName, setCurrentChatRoomName] = useState<string>('');
  const [currentChatRoomId, setCurrentChatRoomId] = useState<number>(1);
  const [messages, setMessages] = useState<any[]>([]); //가져온 채팅 히스토리가 저장되는 messages 
  const [chatRooms, setChatRooms] = useState<any[]>([]);  // 채팅방 목록 상태
  const [inputMessage, setInputMessage] = useState<string>(''); // 입력된 메시지를 저장하는 상태
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const clientRef = useRef<any>(null);

  const config = {
    apiRequestUrl: process.env.REACT_APP_API_REQUEST_URL,
    subUrl: process.env.REACT_APP_WEBSOCKET_SUB_URL,
    pubUrl: process.env.REACT_APP_WEBSOCKET_PUB_URL
  }

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    getChatRoomsByMember("user1");
    if (isChatOpen) {
      setInChatRoom(false); // 채팅창이 닫힐 때 채팅방 상태 초기화
    }
  };

  const enterChatRoom = (chatRoomName: string, chatRoomId: number) => {
    setCurrentChatRoomName(chatRoomName);
    setCurrentChatRoomId(chatRoomId)
    setInChatRoom(true);
    if (inChatRoom) {

    }

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
  }, [inChatRoom, messages]);

  //채팅방 목록 가져오는 useEffect()
  useEffect(() => {
    if (activeTab === 'chat') {
      const fetchChatRooms = async () => {
        try {
          const data = await getChatRoomsByMember('user1'); // user1 임시데이터
          setChatRooms(data);
          // console.log(data) //채팅방 리스트 콘솔에 출력
        } catch (error) {
          console.error('참여한 채팅방 불러오기 오류');
        }
      };

      fetchChatRooms();
      console.log(activeTab) //현재 탭 출력
    }
  }, [activeTab]);

  // 채팅 히스토리 가져오는 useEffect()
  // inChatRoom 값이 true일때 웹소켓 연결 컴포넌트 언마운트 시 return문 실행
  useEffect(() => {
    if (inChatRoom === true) {
      const fetchChatHistory = async () => {
      try {
          const data = await getChatHistory(currentChatRoomId);
          setMessages(data)
        }catch (error){
          console.error("채팅 히스토리 불러오기 오류")
        }
      }
      
      fetchChatHistory();
      console.log(inChatRoom) //채팅방 입장여부 출력
      console.log("현재 입장한 채팅방", currentChatRoomId) //채팅방 입장여부 출력
      console.log(messages) //채팅 히스토리 목록 출력

      //웹소켓 연결 설정
      const socket = new SockJS("http://final-project-app-env.eba-xdjqmujd.ap-northeast-2.elasticbeanstalk.com/api/websocket", {withCredentials:true});
      console.log("apiRequestUrl 출력: ",config.apiRequestUrl);
      console.log("config 출력: ",config);
      const client = Stomp.over(socket);
    
      client.connect({}, () => {
        console.log("config connect함수 안에서 출력: ",config);

        //채팅구독
        client.subscribe(`${config.subUrl}/chat/${currentChatRoomId}`, (message) => {
          console.log('message:',message)
          const newMessage = JSON.parse(message.body);
          console.log('newMessage:',newMessage.body);
          setMessages((prevMessages) => [...prevMessages, newMessage.body]);
        });
      }, (error: any) => {
        console.log('웹소켓 연결 오류', error)
      });

      // STOMP 클라이언트 참조 유지
      clientRef.current = client;

      return () => {
        client.disconnect(() => {
          console.log('웹소켓 연결 종료');
        });
      };

    }
  }, [inChatRoom]);

  const sendMessage = () => {
    if (clientRef.current && inputMessage.trim() !== '') {
      const message = {
        sender: '구름이', // 사용자 이름 또는 ID
        message: inputMessage,
      };
      clientRef.current.send(`${config.pubUrl}/chat/${currentChatRoomId}`, {}, JSON.stringify(message));
      setInputMessage('');
    }
  };

  //채팅방 리스트 렌더링
  const renderChatRoomList = () => (
    <ul className="chat-room-list">
      {chatRooms.map((chatRoom) => (
        <li key={chatRoom.chatRoomId} onClick={() => enterChatRoom(chatRoom.chatRoomName, chatRoom.chatRoomId)}>
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
      {/* <li onClick={() => enterChatRoom('오픈채팅방 1')}>
        <img src="https://via.placeholder.com/40" alt="Open Chat Room" className="chat-room-image" />
        <div className="chat-room-info">
          <div className="chat-room-name">오픈채팅방 1</div>
          <div className="chat-room-last-message">마지막 메시지 내용</div>
        </div>
      </li> */}
    </ul>
  );

  //DB에서 가져온 messages 파싱해서 메시지박스로 변환 후 messagebox변수에 저장해서 반환
  const generateMessages = () => {
    const messagebox: any = [];
    messages.forEach((message) => {
      messagebox.push(
        <div className={`chat-message ${message.sender === '구름이' ? 'right' : 'left'}`} key={message.id}>
          {message.sender === '구름이' && (
            <div className="message-info">
              <span className="unread-count">1</span>
              <span className="message-time">{new Date(message.sendTime).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}</span>
            </div>
          )}

          {message.sender === '구름이' && (
            <div className='message-content'>
              {message.message}
            </div>
          )}
          
          {message.sender !== '구름이' && (
            <div className='others-message'>
              <div className='message-username'>
                <span className='sendername'>{message.sender}</span>
              </div>
              <div className='message-content'>
                {message.message}
              </div>
            </div>
          )}

          {message.sender !== '구름이' && (
            <div className="message-info">
              <span className="unread-count">0</span>
              <span className="message-time">{new Date(message.sendTime).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}</span>
            </div>
          )}
        </div>
      );
    })
    return messagebox;
  }
  
  //채팅 메시지 렌더링 -> renderConent() 에서 호출
  const renderChatMessages = () => (
    <div className="chat-messages">
      {generateMessages()}
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
            <input 
              type="text" 
              placeholder="메시지를 입력하세요"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
            />
            <button onClick={sendMessage}>전송</button>
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
