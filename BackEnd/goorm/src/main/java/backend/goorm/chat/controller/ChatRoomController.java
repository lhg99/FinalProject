package backend.goorm.chat.controller;

import backend.goorm.chat.model.entity.ChatRoom;
import backend.goorm.chat.model.request.ChatRoomInviteRequest;
import backend.goorm.chat.model.request.ChatRoomJoinRequest;
import backend.goorm.chat.model.request.ChatRoomLeaveRequest;
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
    public List<ChatRoomResponse> getPrivateChatRoomsByLoginId(@PathVariable String loginId, Authentication authentication) {
        return chatRoomService.getPrivateChatRoomsByLoginId(loginId, authentication);
    }

    //참여중인 오픈채팅방 목록
    @GetMapping("/public/{loginId}")
    public List<ChatRoomResponse> getPublicChatRoomsByLoginId(@PathVariable String loginId, Authentication authentication) {
        return chatRoomService.getPublicChatRoomsByLoginId(loginId, authentication);
    }

    //개설된 모든 오픈채팅방 목록
    @GetMapping("/public/list/{loginId}")
    public List<ChatRoomResponse> getPublicChatRooms(@PathVariable String loginId, Authentication authentication) {
        return chatRoomService.getPublicChatRooms(loginId, authentication);
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

    //채팅방 초대
    @PostMapping("/invite")
    public ResponseEntity<String> inviteChatRoom(@RequestBody ChatRoomInviteRequest chatRoomInviteRequest, Authentication authentication) {
        chatRoomService.inviteChatRoom(chatRoomInviteRequest, authentication);

        return new ResponseEntity<>("채팅신청되었습니다.", HttpStatus.OK);
    }

    //채팅방 나가기
    @PostMapping("/leave")
    public ResponseEntity<String> leaveChatROom(@RequestBody ChatRoomLeaveRequest chatRoomLeaveRequest, Authentication authentication) {
        chatRoomService.leaveChatRoom(chatRoomLeaveRequest, authentication);
        return ResponseEntity.ok("채팅방을 성공적으로 나갔습니다.");
    }
}
