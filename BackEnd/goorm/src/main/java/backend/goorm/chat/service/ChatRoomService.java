package backend.goorm.chat.service;

import backend.goorm.chat.model.entity.ChatRoom;
import backend.goorm.chat.model.request.ChatRoomRequest;
import backend.goorm.chat.model.response.ChatRoomResponse;
import backend.goorm.chat.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;

    public ChatRoomResponse createChatRoom(ChatRoomRequest chatRoomRequest) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setChatRoomName(chatRoomRequest.getChatRoomName());

        ChatRoom saved = chatRoomRepository.save(chatRoom);

        return ChatRoomResponse.changeResponse(saved);
    }
}
