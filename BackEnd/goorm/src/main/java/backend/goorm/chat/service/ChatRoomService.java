package backend.goorm.chat.service;

import backend.goorm.chat.model.entity.ChatRoom;
import backend.goorm.chat.model.request.ChatRoomRequest;
import backend.goorm.chat.model.response.ChatRoomResponse;
import backend.goorm.chat.repository.ChatRoomRepository;
import backend.goorm.member.model.entity.Member;
import backend.goorm.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final MemberRepository memberRepository;

    public ChatRoomResponse createChatRoom(ChatRoomRequest chatRoomRequest) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setChatRoomName(chatRoomRequest.getChatRoomName());

        ChatRoom saved = chatRoomRepository.save(chatRoom);

        return ChatRoomResponse.changeResponse(saved);
    }

    public List<ChatRoomResponse> getChatRoomsByMember(String loginId) {
        Optional<Member> member = memberRepository.findByLoginId(loginId);
        return member.get().getChatRooms()
                .stream()
                .map(ChatRoomResponse::changeResponse)
                .collect(Collectors.toList());
    }
}
