package backend.goorm.chat.service;

import backend.goorm.chat.model.request.ChatRequest;
import backend.goorm.chat.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;

    public void sendChat(ChatRequest chatRequest) {

    }
}
