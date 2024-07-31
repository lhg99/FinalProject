import React, { useState, useEffect, useRef } from "react";
import "./FloatingButtonWithChat.scss"; // 스타일 파일을 추가
import {
   getPrivateChatRoomsByMember,
   getChatHistory,
   getPublicChatRoomsByMember,
   getPublicChatRoom,
   joinChatRoom,
   createChatRoom,
} from "../api/chatApi";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Modal from "react-modal";

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

   const config = {
      apiRequestUrl: process.env.REACT_APP_API_REQUEST_URL,
      subUrl: process.env.REACT_APP_WEBSOCKET_SUB_URL,
      pubUrl: process.env.REACT_APP_WEBSOCKET_PUB_URL,
   };

   const toggleChat = () => {
      setIsChatOpen(!isChatOpen);
      getPrivateChatRoomsByMember("user1");
      if (isChatOpen) {
         setInChatRoom(false); // 채팅창이 닫힐 때 채팅방 상태 초기화
      }
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

   //메시지 발송
   const sendMessage = () => {
      if (clientRef.current && inputMessage.trim() !== "") {
         const message = {
            chatType: "MESSAGE",
            sender: "구름이", // 사용자 이름 또는 ID
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
         sender: "구름이",
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
         sender: "구름이",
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
   const confirmEnterChatRoom = () => {
      if (selectedChatRoom) {
         callJoinChatRoom(selectedChatRoom);
         setCurrentChatRoomName(selectedChatRoom.chatRoomName);
         setCurrentChatRoomId(selectedChatRoom.chatRoomId);
         setInChatRoom(true);
         setTimeout(sendJoinMessage, 100);

         console.log("선택된 채팅방", selectedChatRoom);
      }
      closeModal();
   };

   //채팅방 참여정보 전송 함수 (모달창에서 확인클릭 시 동작)
   const callJoinChatRoom = async (chatRoom: any) => {
      console.log("callJoinChatRoom: ",chatRoom.chatRoomId)
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
      console.log(activeTab); //현재 탭 출력
      // 1:1 채팅방 목록 출력
      if (activeTab === "chat") {
         const fetchChatRooms = async () => {
            try {
               const data = await getPrivateChatRoomsByMember("user1"); // user1 임시데이터
               setChatRooms(data);
               console.log(data); //채팅방 리스트 콘솔에 출력
            } catch (error) {
               console.error("참여한 채팅방 불러오기 오류");
            }
         };

         fetchChatRooms();
         console.log(activeTab); //현재 탭 출력
      }

      if (activeTab === "openChat") {
         const fetchChatRooms = async () => {
            try {
               const data = await getPublicChatRoomsByMember("user1"); // user1 임시데이터
               setChatRooms(data);
               console.log(data); //채팅방 리스트 콘솔에 출력
               console.log(chatRooms);
            } catch (error) {
               console.error("참여한 채팅방 불러오기 오류");
            }
         };

         fetchChatRooms();
         console.log(activeTab); //현재 탭 출력
      }

      if (activeTab === "home") {
         const fetchChatRooms = async () => {
            try {
               const data = await getPublicChatRoom("user1"); // user1 임시데이터
               setChatRooms(data);
               // console.log(data) //채팅방 리스트 콘솔에 출력
            } catch (error) {
               console.error("참여한 채팅방 불러오기 오류");
            }
         };

         fetchChatRooms();
         console.log(activeTab); //현재 탭 출력
      }
   }, [activeTab]);

   // 채팅 히스토리 가져오는 useEffect()
   // inChatRoom 값이 true일때 웹소켓 연결 컴포넌트 언마운트 시 return문 실행
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
         // console.log(inChatRoom) //채팅방 입장여부 출력
         console.log("현재 입장한 채팅방: ", currentChatRoomId); //채팅방 입장여부 출력
         console.log("채팅 히스토리: ", messages); //채팅 히스토리 목록 출력

         //웹소켓 연결 설정
         const socket = new SockJS("http://final-project-app-env.eba-xdjqmujd.ap-northeast-2.elasticbeanstalk.com/api/websocket", {
            withCredentials: true,
         });
         // console.log("apiRequestUrl 출력: ",config.apiRequestUrl);
         // console.log("config 출력: ",config);
         const client = Stomp.over(socket);

         client.connect(
            {},
            () => {
               console.log("config connect함수 안에서 출력: ", config);

               //채팅구독
               client.subscribe(
                  `/api/sub/chat/${currentChatRoomId}`,
                  (message) => {
                     // console.log('message:',message)
                     const newMessage = JSON.parse(message.body);
                     console.log("newMessage:", newMessage.body);
                     setMessages((prevMessages) => [
                        ...prevMessages,
                        newMessage.body,
                     ]);
                  }
               );

               client.subscribe(
                  `/api/sub/join/${currentChatRoomId}`,
                  (message) => {
                     // console.log('message:',message)
                     const newMessage = JSON.parse(message.body);
                     console.log("newJoinMessage:", newMessage.body);
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

         // STOMP 클라이언트 참조 유지
         clientRef.current = client;

         return () => {
            sendLeaveMessage();
            client.disconnect(() => {
               console.log("웹소켓 연결 종료");
            });
         };
      }
   }, [inChatRoom]);

   //1:1 채팅방 리스트 렌더링
   const renderChatRoomList = () => (
      <ul className="chat-room-list">
         {chatRooms.map((chatRoom) => (
            <li
               key={chatRoom.chatRoomId}
               onClick={() => enterChatRoom(chatRoom)}
            >
               <img
                  src="https://via.placeholder.com/40"
                  alt="Chat Room"
                  className="chat-room-image"
               />
               <div className="chat-room-info">
                  <div className="chat-room-name">{chatRoom.chatRoomName}</div>
                  <div className="chat-room-last-message">샘플 메시지</div>
               </div>
            </li>
         ))}
      </ul>
   );

   //오픈 채팅방 리스트 렌더링
   const renderOpenChatRoomList = () => (
      <ul className="chat-room-list">
         {chatRooms.map((chatRoom) => (
            <li
               key={chatRoom.chatRoomId}
               onClick={() => enterChatRoom(chatRoom)}
            >
               <img
                  src="https://via.placeholder.com/40"
                  alt="Chat Room"
                  className="chat-room-image"
               />
               <div className="chat-room-info">
                  <div className="chat-room-name">{chatRoom.chatRoomName}</div>
                  <div className="chat-room-last-message">샘플 메시지</div>
               </div>
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
                  src="https://via.placeholder.com/40"
                  alt="Chat Room"
                  className="chat-room-image"
               />
               <div className="chat-room-info">
                  <div className="chat-room-name">{chatRoom.chatRoomName}</div>
                  <div className="chat-room-last-message">샘플 메시지</div>
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
                     message.sender === "구름이" ? "right" : "left"
                  }`}
                  key={message.id}
               >
                  {message.sender === "구름이" && (
                     <div className="message-info">
                        <span className="unread-count">1</span>
                        <span className="message-time">
                           {formatTime(message.sendTime)}
                        </span>
                     </div>
                  )}

                  {message.sender === "구름이" && (
                     <div className="message-content">{message.message}</div>
                  )}

                  {message.sender !== "구름이" && (
                     <div className="others-message">
                        <div className="message-username">
                           <span className="sendername">{message.sender}</span>
                        </div>
                        <div className="message-content">{message.message}</div>
                     </div>
                  )}

                  {message.sender !== "구름이" && (
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
               <div className="chat-body">
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
            return <div className="chat-body">{renderChatRoomList()}</div>;
         case "openChat":
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
                     <button
                        onClick={() => setActiveTab("home")}
                        className={activeTab === "home" ? "active" : ""}
                     >
                        홈
                     </button>
                     <button
                        onClick={() => setActiveTab("chat")}
                        className={activeTab === "chat" ? "active" : ""}
                     >
                        채팅
                     </button>
                     <button
                        onClick={() => setActiveTab("openChat")}
                        className={activeTab === "openChat" ? "active" : ""}
                     >
                        오픈채팅
                     </button>
                  </nav>
               )}
            </div>
         )}
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
