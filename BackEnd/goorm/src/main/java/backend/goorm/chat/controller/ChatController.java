package backend.goorm.chat.controller;

import backend.goorm.chat.model.request.ChatRequest;
import backend.goorm.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    // 구독주소 : api/sub/{roomId}
    // 발행주소 : api/pub/{roomId}
    @MessageMapping("/{roomId}")
    @SendTo("/api/pub/{roomId}")
    public void chat(@DestinationVariable Long roomId, ChatRequest chatRequest) {
        chatService.sendChat(chatRequest);
    }
}
