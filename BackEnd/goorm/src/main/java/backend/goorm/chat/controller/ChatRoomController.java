package backend.goorm.chat.controller;

import backend.goorm.chat.model.entity.ChatRoom;
import backend.goorm.chat.model.request.ChatRoomJoinRequest;
import backend.goorm.chat.model.request.ChatRoomRequest;
import backend.goorm.chat.model.response.ChatRoomResponse;
import backend.goorm.chat.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatroom")
public class ChatRoomController {
    private final ChatRoomService chatRoomService;

    //참여중인 1:1 채팅방 목록
    @GetMapping("/private/{loginId}")
    public List<ChatRoomResponse> getPrivateChatRoomsByLoginId(@PathVariable String loginId) {
        return chatRoomService.getPrivateChatRoomsByLoginId(loginId);
    }

    //참여중인 오픈채팅방 목록
    @GetMapping("/public/{loginId}")
    public List<ChatRoomResponse> getPublicChatRoomsByLoginId(@PathVariable String loginId) {
        return chatRoomService.getPublicChatRoomsByLoginId(loginId);
    }

    //개설된 모든 오픈채팅방 목록
    @GetMapping("/public/list/{loginId}")
    public List<ChatRoomResponse> getPublicChatRooms(@PathVariable String loginId) {
        return chatRoomService.getPublicChatRooms(loginId);
    }

    //채팅방 생성
    @PostMapping
    public ResponseEntity<ChatRoomResponse> createChatRoom(@RequestBody ChatRoomRequest chatRoomRequest) {
        ChatRoomResponse chatRoom = chatRoomService.createChatRoom(chatRoomRequest);

        return new ResponseEntity<>(chatRoom, HttpStatus.OK);
    }

    //채팅방 참여
    @PostMapping("/join")
    public ResponseEntity<String> joinChatRoom(@RequestBody ChatRoomJoinRequest chatRoomJoinRequest, Authentication authentication) {
        String joinMessage = chatRoomService.joinChatRoom(chatRoomJoinRequest, authentication);

        return new ResponseEntity<>(joinMessage, HttpStatus.OK);
    }

}
