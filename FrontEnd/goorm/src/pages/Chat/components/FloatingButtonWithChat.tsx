import React, { useState, useEffect, useRef } from "react";
import "./FloatingButtonWithChat.scss"; // 스타일 파일을 추가
import {
   getPrivateChatRoomsByMember,
   getChatHistory,
   getPublicChatRoomsByMember,
   getPublicChatRoom,
   joinChatRoom,
   createChatRoom,
   getMemberNickname,
   leaveChatRoom
} from "../api/chatApi";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Modal from "react-modal";
import chatIcon from "../../../image/Icon/chatIcon.png"
import chatting from "../../../image/Icon/chatting.png"
import openChatting from "../../../image/Icon/openchatting.png"
import homeIcon from "../../../image/Icon/homeIcon.png"; // 홈 아이콘 추가

Modal.setAppElement("#root");

const FloatingButtonWithChat: React.FC = () => {
   const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
   const [activeTab, setActiveTab] = useState<string>("home");
   const [inChatRoom, setInChatRoom] = useState<boolean>(false);
   const [currentChatRoomName, setCurrentChatRoomName] = useState<string>("");
   const [currentChatRoomId, setCurrentChatRoomId] = useState<number>(1);
   const [messages, setMessages] = useState<any[]>([]); //가져온 채팅 히스토리가 저장되는 messages
   const [chatRooms, setChatRooms] = useState<any[]>([]); // 채팅방 목록 상태
   const [inputMessage, setInputMessage] = useState<string>(""); // 입력된 메시지를 저장하는 상태
   const messagesEndRef = useRef<HTMLDivElement | null>(null);
   const clientRef = useRef<any>(null);
   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
   const [selectedChatRoom, setSelectedChatRoom] = useState<any>(null); //채팅방 입장 전 입장여부 확인하기 위한 변수
   const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
   const [newChatRoomName, setNewChatRoomName] = useState<string>("");
   const [currentUser, setCurrentUser] = useState<string>("");
   const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false); // 채팅방 나가기 모달 상태
   const [leavingChatRoomId, setLeavingChatRoomId] = useState<number | null>(null); // 나가려는 채팅방 ID
   const [tabAnimationKey, setTabAnimationKey] = useState<number>(0);

   const config = {
      apiRequestUrl: process.env.REACT_APP_API_REQUEST_URL,
      subUrl: process.env.REACT_APP_WEBSOCKET_SUB_URL,
      pubUrl: process.env.REACT_APP_WEBSOCKET_PUB_URL,
   };

   const toggleChat = async () => {
      setIsChatOpen(!isChatOpen);
      const response = await getMemberNickname();
      setCurrentUser(response.username);
      if (isChatOpen) {
         setInChatRoom(false); // 채팅창이 닫힐 때 채팅방 상태 초기화
      }
   };

   const handleTabChange = (tab: string) => {
      setActiveTab(tab);
      setTabAnimationKey((prevKey) => prevKey + 1); // 애니메이션 트리거
    };
    

   // 입장확인 모달 열기 함수
   const openModal = (chatRoom: any) => {
      setSelectedChatRoom(chatRoom);
      setIsModalOpen(true);
   };

   // 입장확인 모달 닫기 함수
   const closeModal = () => {
      setIsModalOpen(false);
      setSelectedChatRoom(null);
   };

   // 채팅방 개설 모달 열기 함수
   const openCreateModal = () => {
      setIsCreateModalOpen(true);
   };

   // 채팅방 개설 모달 닫기 함수
   const closeCreateModal = () => {
      setIsCreateModalOpen(false);
   };

   // 나가기 모달 열기
   const openLeaveModal = (chatRoomId: number) => {
      setLeavingChatRoomId(chatRoomId);
      setIsLeaveModalOpen(true);
   };

   // 나가기 모달 닫기
   const closeLeaveModal = () => {
      setLeavingChatRoomId(null);
      setIsLeaveModalOpen(false);
   };

   // 채팅방 나가기 확정 함수
   const confirmLeaveChatRoom = async () => {
      if (leavingChatRoomId !== null) {
         try {
            await leaveChatRoom(leavingChatRoomId);
            setChatRooms(chatRooms.filter(room => room.chatRoomId !== leavingChatRoomId)); // 리스트에서 제거
            closeLeaveModal();
         } catch (error) {
            console.error("채팅방 나가기 오류");
         }
      }
   };

   //채팅방 나가기
   const callLeaveChatRoom = async (chatRoomId: number) => {
      try {
         await leaveChatRoom(chatRoomId);
         setChatRooms(chatRooms.filter(room => room.chatRoomId !== chatRoomId)); // 나간 채팅방을 리스트에서 제거
      } catch (error) {
         console.error("채팅방 나가기 오류");
      }
   };

   //메시지 발송
   const sendMessage = () => {
      if (clientRef.current && inputMessage.trim() !== "") {
         const message = {
            chatType: "MESSAGE",
            sender: currentUser, // 사용자 이름 또는 ID
            message: inputMessage,
         };
         clientRef.current.send(
            `/api/pub/chat/${currentChatRoomId}`,
            {},
            JSON.stringify(message)
         );
         setInputMessage("");
      }
   };

   const sendJoinMessage = () => {
      const message = {
         chatType: "SYSTEM",
         sender: currentUser,
         message: "님이 입장하셨습니다.",
      };
      clientRef.current.send(
         `/api/pub/join/${currentChatRoomId}`,
         {},
         JSON.stringify(message)
      );
   };

   const sendLeaveMessage = () => {
      const message = {
         chatType: "SYSTEM",
         sender: currentUser,
         message: "님이 퇴장하셨습니다.",
      };
      clientRef.current.send(
         `/api/pub/join/${currentChatRoomId}`,
         {},
         JSON.stringify(message)
      );
   };

   //채팅방 입장 함수
   const enterChatRoom = (chatRoom: any) => {
      setCurrentChatRoomName(chatRoom.chatRoomName);
      setCurrentChatRoomId(chatRoom.chatRoomId);
      setInChatRoom(true);
      setTimeout(sendJoinMessage, 100);
   };

   //입장 확인 후 채팅방 입장 함수
   const confirmEnterChatRoom = async () => {
      if (selectedChatRoom) {
         await callJoinChatRoom(selectedChatRoom);
         setCurrentChatRoomName(selectedChatRoom.chatRoomName);
         setCurrentChatRoomId(selectedChatRoom.chatRoomId);
         setInChatRoom(true);
         setTimeout(sendJoinMessage, 100);
         await fetchChatRooms(); // 채팅방 리스트를 다시 가져옴
      }
      closeModal();
   };

   //채팅방 참여정보 전송 함수 (모달창에서 확인클릭 시 동작)
   const callJoinChatRoom = async (chatRoom: any) => {
      try {
         await joinChatRoom(chatRoom.chatRoomId);
      } catch (error) {
         console.log("채팅방 참여하기 오류");
      }
   };

   const callCreateChatRoom = async (
      chatRoomName: string,
      chatRoomType: string
   ) => {
      try {
         const data = await createChatRoom(chatRoomName, chatRoomType);
         closeCreateModal();
         setNewChatRoomName("");
         enterChatRoom(data);
      } catch (error) {
         console.log("채팅방 개설 오류");
      }
   };

   //스크롤 하단으로 이동하는 함수
   const scrollToBottom = () => {
      if (messagesEndRef.current) {
         messagesEndRef.current.scrollIntoView({ behavior: "auto" });
      }
   };

   //채팅시간 파싱 함수
   const formatTime = (sendTime: any) => {
      const date = new Date(sendTime);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "오후" : "오전";
      const formattedHours = hours % 12 || 12; //hours % 12 가 0이면 (거짓이면) 12를 반환
      const formattedMinutes = minutes.toString().padStart(2, "0"); // 시간이 1자리수면 앞에 0을 추가 ex/ 01시 , 02시
      return `${ampm} ${formattedHours}:${formattedMinutes}`;
   };

   //채팅방 입장, 메시지 입력 시 스크롤 제일 하단으로 이동하는 userEffect()
   useEffect(() => {
      if (inChatRoom) {
         scrollToBottom();
      }
   }, [inChatRoom, messages]);

   //채팅방 목록 가져오는 useEffect()
   useEffect(() => {
      fetchChatRooms();
   }, [activeTab]);

   const fetchChatRooms = async () => {
      try {
         let data;
         if (activeTab === "chat") {
            data = await getPrivateChatRoomsByMember("user1"); // user1 임시데이터
         } else if (activeTab === "openChat") {
            data = await getPublicChatRoomsByMember("user1"); // user1 임시데이터
         } else {
            data = await getPublicChatRoom("user1"); // user1 임시데이터
         }
         setChatRooms(data);
      } catch (error) {
         console.error("참여한 채팅방 불러오기 오류");
      }
   };

   // 채팅 히스토리 가져오는 useEffect()
   useEffect(() => {
      if (inChatRoom === true) {
         const fetchChatHistory = async () => {
            try {
               const data = await getChatHistory(currentChatRoomId);
               setMessages(data);
            } catch (error) {
               console.error("채팅 히스토리 불러오기 오류");
            }
         };

         fetchChatHistory();

         const socket = new SockJS("http://www.eadyfit.com/api/websocket", {
            withCredentials: true,
         });
         const client = Stomp.over(socket);

         client.connect(
            {},
            () => {
               client.subscribe(
                  `/api/sub/chat/${currentChatRoomId}`,
                  (message) => {
                     const newMessage = JSON.parse(message.body);
                     setMessages((prevMessages) => [
                        ...prevMessages,
                        newMessage.body,
                     ]);
                  }
               );

               client.subscribe(
                  `/api/sub/join/${currentChatRoomId}`,
                  (message) => {
                     const newMessage = JSON.parse(message.body);
                     setMessages((prevMessages) => [
                        ...prevMessages,
                        newMessage.body,
                     ]);
                  }
               );
            },
            (error: any) => {
               console.log("웹소켓 연결 오류", error);
            }
         );

         clientRef.current = client;

         return () => {
            sendLeaveMessage();
            client.disconnect(() => {
               console.log("웹소켓 연결 종료");
            });
         };
      }
   }, [inChatRoom]);

   // 1:1 채팅방 리스트 렌더링
   const renderChatRoomList = () => (
      <ul className="chat-room-list">
         {chatRooms.map((chatRoom) => (
            <li key={chatRoom.chatRoomId}>
               <img
                  src={chatIcon}
                  alt="Chat Room"
                  className="chat-room-image"
                  onClick={() => enterChatRoom(chatRoom)}
               />
               <div
                  className="chat-room-info"
                  onClick={() => enterChatRoom(chatRoom)}
               >
                  <div className="chat-room-name">{chatRoom.chatRoomName}</div>
                  <div className="chat-room-last-message"></div>
               </div>
               <button
                  className="leave-button"
                  onClick={() => openLeaveModal(chatRoom.chatRoomId)}
               >
                  나가기
               </button>
            </li>
         ))}
      </ul>
   );

   // 오픈 채팅방 리스트 렌더링
   const renderOpenChatRoomList = () => (
      <ul className="chat-room-list">
         {chatRooms.map((chatRoom) => (
            <li key={chatRoom.chatRoomId}>
               <img
                  src={chatIcon}
                  alt="Chat Room"
                  className="chat-room-image"
                  onClick={() => enterChatRoom(chatRoom)}
               />
               <div
                  className="chat-room-info"
                  onClick={() => enterChatRoom(chatRoom)}
               >
                  <div className="chat-room-name">{chatRoom.chatRoomName}</div>
                  <div className="chat-room-last-message"></div>
               </div>
               <button
                  className="leave-button"
                  onClick={() => openLeaveModal(chatRoom.chatRoomId)}
               >
                  나가기
               </button>
            </li>
         ))}
      </ul>
   );

   //참여하지 않은 오픈 채팅방 리스트 렌더링  (채팅방 입장 전 모달창으로 입장확인)
   const renderHomeList = () => (
      <ul className="chat-room-list">
         {chatRooms.map((chatRoom) => (
            <li key={chatRoom.chatRoomId} onClick={() => openModal(chatRoom)}>
               <img
                  src={chatIcon}
                  alt="Chat Room"
                  className="chat-room-image"
               />
               <div className="chat-room-info">
                  <div className="chat-room-name">{chatRoom.chatRoomName}</div>
                  <div className="chat-room-last-message"></div>
               </div>
            </li>
         ))}
      </ul>
   );

   //DB에서 가져온 messages 파싱해서 메시지박스로 변환 후 messagebox변수에 저장해서 반환
   const generateMessages = () => {
      const messagebox: any = [];
      messages.forEach((message) => {
         if (message.chatType === "SYSTEM") {
            messagebox.push(
               <div className="chat-message system" key={message.id}>
                  <div className="message-content">
                     {`${message.sender}${message.message}`}
                  </div>
               </div>
            );
         } else {
            messagebox.push(
               <div
                  className={`chat-message ${
                     message.sender === currentUser ? "right" : "left"
                  }`}
                  key={message.id}
               >
                  {message.sender === currentUser && (
                     <div className="message-info">
                        <span className="unread-count">1</span>
                        <span className="message-time">
                           {formatTime(message.sendTime)}
                        </span>
                     </div>
                  )}

                  {message.sender === currentUser && (
                     <div className="message-content">{message.message}</div>
                  )}

                  {message.sender !== currentUser && (
                     <div className="others-message">
                        <div className="message-username">
                           <span className="sendername">{message.sender}</span>
                        </div>
                        <div className="message-content">{message.message}</div>
                     </div>
                  )}

                  {message.sender !== currentUser && (
                     <div className="message-info">
                        <span className="unread-count">0</span>
                        <span className="message-time">
                           {formatTime(message.sendTime)}
                        </span>
                     </div>
                  )}
               </div>
            );
         }
      });
      return messagebox;
   };

   //채팅 메시지 렌더링 -> renderConent() 에서 호출
   // 메시지가 렌더링 될 때 ref위치로 이동(스크롤 하단으로 이동)
   const renderChatMessages = () => (
      <div className="chat-messages">
         {generateMessages()}
         <div ref={messagesEndRef} />
      </div>
   );

   const renderChatRoomHeader = () => (
      <div className="chat-room-header">
         <button className="back-button" onClick={() => setInChatRoom(false)}>
            〈
         </button>
         <h2>{currentChatRoomName}</h2>
         <div className="header-spacer"></div>
      </div>
   );

   const renderChatListHeader = () => (
      <div className="chat-list-header">
         <h2>
            {activeTab === "home"
               ? "홈"
               : activeTab === "chat"
               ? "채팅"
               : "오픈채팅"}
         </h2>

         <button onClick={toggleChat} className="close-button">
            ×
         </button>
      </div>
   );

   const renderNavigation = () => (
      <nav className="chat-nav">
        <button
          onClick={() => handleTabChange("home")}
          className={activeTab === "home" ? "active" : ""}
        >
          <img src={homeIcon} alt="Home" className="nav-icon" />
          <span>홈</span>
        </button>
        <button
          onClick={() => handleTabChange("chat")}
          className={activeTab === "chat" ? "active" : ""}
        >
          <img src={chatting} alt="Chat" className="nav-icon" />
          <span>채팅</span>
        </button>
        <button
          onClick={() => handleTabChange("openChat")}
          className={activeTab === "openChat" ? "active" : ""}
        >
          <img src={openChatting} alt="Open Chat" className="nav-icon" />
          <span>오픈채팅</span>
        </button>
      </nav>
    );
    

   //채팅방에 입장하면 채팅내용과 메시지 입력란을 렌더링하는 함수
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
                  if (e.key === "Enter") {
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
        case "home":
          return (
            <div key={tabAnimationKey} className="chat-body">
              {renderHomeList()}
              <button
                className="create-open-chat-button"
                onClick={openCreateModal}
              >
                오픈채팅 만들기
              </button>
            </div>
          );
        case "chat":
          return (
            <div key={tabAnimationKey} className="chat-body">
              {renderChatRoomList()}
            </div>
          );
        case "openChat":
          return (
            <div key={tabAnimationKey} className="chat-body">
              {renderOpenChatRoomList()}
            </div>
          );
        default:
          return null;
      }
    };
    

   return (
      <div>
         <button className="floating-button" onClick={toggleChat}>
            <img src={chatting} alt="Chat Icon" className="floating-button-icon"/>
         </button>
         {isChatOpen && (
            <div className="chat-window">
               {inChatRoom ? renderChatRoomHeader() : renderChatListHeader()}
               {renderContent()}
               {!inChatRoom && renderNavigation()}
            </div>
         )}

         {/* 채팅방 입장 확인 모달 */}
         <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            className="modal"
            overlayClassName="modal-overlay"
            contentLabel="채팅방 입장 확인"
            parentSelector={() =>
               document.querySelector(".chat-window") || document.body
            }
         >
            <h2>알림</h2>
            <div className="modal-content">
               <p>채팅방에 입장하시겠습니까?</p>
               <div className="modal-buttons">
                  <button
                     className="confirm-button"
                     onClick={() => {
                        confirmEnterChatRoom();
                     }}
                  >
                     확인
                  </button>
                  <button className="cancel-button" onClick={closeModal}>
                     취소
                  </button>
               </div>
            </div>
         </Modal>

         {/* 채팅방 나가기 확인 모달 */}
         <Modal
            isOpen={isLeaveModalOpen}
            onRequestClose={closeLeaveModal}
            className="modal"
            overlayClassName="modal-overlay"
            contentLabel="채팅방 나가기 확인"
            parentSelector={() =>
               document.querySelector(".chat-window") || document.body
            }
         >
            <h2>알림</h2>
            <div className="modal-content">
               <p>채팅방에서 나가시겠습니까?</p>
               <div className="modal-buttons">
                  <button
                     className="confirm-button"
                     onClick={() => {
                        confirmLeaveChatRoom();
                     }}
                  >
                     확인
                  </button>
                  <button className="cancel-button" onClick={closeLeaveModal}>
                     취소
                  </button>
               </div>
            </div>
         </Modal>

         <Modal
            isOpen={isCreateModalOpen}
            onRequestClose={closeCreateModal}
            className="modal create-chat-modal"
            overlayClassName="modal-overlay"
            contentLabel="오픈채팅 만들기"
            parentSelector={() =>
               document.querySelector(".chat-window") || document.body
            }
         >
            <h2>오픈채팅 만들기</h2>
            <div className="modal-content">
               <input
                  type="text"
                  placeholder="채팅방 이름을 입력하세요"
                  value={newChatRoomName}
                  onChange={(e) => setNewChatRoomName(e.target.value)}
               />
               <div className="modal-buttons">
                  <button
                     className="confirm-button"
                     onClick={() =>
                        callCreateChatRoom(newChatRoomName, "PUBLIC")
                     }
                  >
                     확인
                  </button>
                  <button className="cancel-button" onClick={closeCreateModal}>
                     취소
                  </button>
               </div>
            </div>
         </Modal>
      </div>
   );
};

export default FloatingButtonWithChat;
