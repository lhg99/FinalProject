package backend.goorm.chat.controller;

import backend.goorm.chat.model.entity.ChatRoom;
import backend.goorm.chat.model.request.ChatRoomRequest;
import backend.goorm.chat.model.response.ChatResponse;
import backend.goorm.chat.model.response.ChatRoomResponse;
import backend.goorm.chat.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ChatRoomController {
    private final ChatRoomService chatRoomService;

    //참여중인 채팅방 목록
    @GetMapping("/members/{loginId}/chatrooms")
    public List<ChatRoomResponse> getChatRoomsByMember(@PathVariable String loginId) {
        return chatRoomService.getChatRoomsByMember(loginId);
    }

    //채팅방 생성
    @PostMapping("/chat_room")
    public ResponseEntity<ChatRoomResponse> createChatRoom(@RequestBody ChatRoomRequest chatRoomRequest) {
        ChatRoomResponse chatRoom = chatRoomService.createChatRoom(chatRoomRequest);

        return new ResponseEntity<>(chatRoom, HttpStatus.OK);
    }

}
