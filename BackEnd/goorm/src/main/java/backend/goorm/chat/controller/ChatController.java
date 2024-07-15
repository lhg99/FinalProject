package backend.goorm.chat.controller;

import backend.goorm.chat.model.entity.Chat;
import backend.goorm.chat.model.entity.ChatRoom;
import backend.goorm.chat.model.request.ChatRequest;
import backend.goorm.chat.model.response.ChatResponse;
import backend.goorm.chat.repository.ChatRepository;
import backend.goorm.chat.repository.ChatRoomRepository;
import backend.goorm.chat.service.ChatService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@Transactional
public class ChatController {
    private final ChatService chatService;
    private final ChatRepository chatRepository;
    private final ChatRoomRepository chatRoomRepository;

    // 구독주소 : api/sub/{roomId}
    // 발행주소 : api/pub/{roomId}
    @MessageMapping("/{roomId}")
    @SendTo("/api/pub/{roomId}")
    public void chat(@DestinationVariable Long roomId, ChatRequest chatRequest) {
        chatService.sendChat(chatRequest);
    }

    @PostMapping("/api/con_test")
    public ChatResponse conTest(@RequestBody ChatRequest chatRequest) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setName("test chatroom");
        ChatRoom saved = chatRoomRepository.save(chatRoom);

        Chat chat = new Chat();
        chat.setRoom(saved);
        chat.setMessage("test message");
        chat.setSender(chatRequest.getSender());
        chat.setSendDate(LocalDateTime.now());
        Chat savedChat = chatRepository.save(chat);

        return ChatResponse.changeResponse(savedChat);

    }
}
