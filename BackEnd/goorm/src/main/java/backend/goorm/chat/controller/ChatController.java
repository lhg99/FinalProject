package backend.goorm.chat.controller;

import backend.goorm.chat.model.request.ChatRequest;
import backend.goorm.chat.model.request.ChatRoomRequest;
import backend.goorm.chat.model.response.ChatResponse;
import backend.goorm.chat.model.response.ChatRoomResponse;
import backend.goorm.chat.repository.ChatRepository;
import backend.goorm.chat.repository.ChatRoomRepository;
import backend.goorm.chat.service.ChatRoomService;
import backend.goorm.chat.service.ChatService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    //채팅입력
    @MessageMapping("/chat/{roomId}")
    @SendTo("/api/sub/chat/{roomId}")
    public ResponseEntity<ChatResponse> chat(@DestinationVariable Long roomId, @RequestBody ChatRequest chatRequest) {
        ChatResponse chatResponse = chatService.sendChat(roomId, chatRequest);

        return new ResponseEntity<>(chatResponse, HttpStatus.OK);
    }

    //입장 메시지
    @MessageMapping("/join/{roomId}")
    @SendTo("/api/sub/join/{roomId}")
    public ResponseEntity<ChatResponse> join(@DestinationVariable Long roomId, @RequestBody ChatRequest chatRequest) {
        ChatResponse chatResponse = chatService.joinChat(roomId, chatRequest);

        return new ResponseEntity<>(chatResponse, HttpStatus.OK);
    }

    //채팅 히스토리
    @GetMapping("/api/history/{chatRoomId}")
    public ResponseEntity<List<ChatResponse>> chatHistory(@PathVariable Long chatRoomId) {
        List<ChatResponse> chatResponses = chatService.chatHistory(chatRoomId);

        return new ResponseEntity<>(chatResponses, HttpStatus.OK);
    }
}
