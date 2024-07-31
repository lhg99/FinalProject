package backend.goorm.chat.service;

import backend.goorm.chat.model.entity.ChatRoom;
import backend.goorm.chat.model.entity.enums.ChatRoomStatus;
import backend.goorm.chat.model.entity.enums.ChatRoomType;
import backend.goorm.chat.model.request.ChatRoomJoinRequest;
import backend.goorm.chat.model.request.ChatRoomRequest;
import backend.goorm.chat.model.response.ChatRoomResponse;
import backend.goorm.chat.repository.ChatRoomRepository;
import backend.goorm.common.exception.CustomException;
import backend.goorm.common.exception.CustomExceptionType;
import backend.goorm.member.model.entity.Member;
import backend.goorm.member.oauth.PrincipalDetails;
import backend.goorm.member.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final MemberRepository memberRepository;

    //채팅방 생성
    public ChatRoomResponse createChatRoom(ChatRoomRequest chatRoomRequest) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setChatRoomName(chatRoomRequest.getChatRoomName());
        chatRoom.setChatRoomType(chatRoomRequest.getChatRoomType());
        chatRoom.setChatRoomStatus(ChatRoomStatus.ACTIVE);
        ChatRoom saved = chatRoomRepository.save(chatRoom);

        return ChatRoomResponse.changeResponse(saved);
    }

    //loginId로 1:1 채팅방 목록 조회
    public List<ChatRoomResponse> getPrivateChatRoomsByLoginId(String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(CustomExceptionType.CHAT_ROOM_NOT_FOUND));

        return member.getChatRooms()
                .stream()
                .filter(chatRoom -> chatRoom.getChatRoomType() == ChatRoomType.PRIVATE)
                .map(ChatRoomResponse::changeResponse)
                .collect(Collectors.toList());
    }

    //loginId로 오픈채팅방 목록 조회
    public List<ChatRoomResponse> getPublicChatRoomsByLoginId(String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(CustomExceptionType.CHAT_ROOM_NOT_FOUND));

        return member.getChatRooms()
                .stream()
                .filter(chatRoom -> chatRoom.getChatRoomType() == ChatRoomType.PUBLIC)
                .map(ChatRoomResponse::changeResponse)
                .collect(Collectors.toList());
    }

    //참여하지 않은 오픈채팅방 조회
    public List<ChatRoomResponse> getPublicChatRooms(String loginId) {
        List<ChatRoom> findAllChatRooms = chatRoomRepository.findAll();
        Member findMember = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(CustomExceptionType.USER_NOT_FOUND));

        return findAllChatRooms
                .stream()
                .filter(chatRoom -> chatRoom.getChatRoomType() == ChatRoomType.PUBLIC)
                .filter(chatRoom -> !chatRoom.getMembers().contains(findMember))
                .map(ChatRoomResponse::changeResponse)
                .collect(Collectors.toList());
    }

    //채팅방 참여
    public String joinChatRoom(ChatRoomJoinRequest chatRoomJoinRequest, Authentication authentication) {
//        Member findMember = memberRepository.findByLoginId(chatRoomJoinRequest.getLoginId())
//                .orElseThrow(() -> new CustomException(CustomExceptionType.USER_NOT_FOUND));

        // 로그인사용자정보 받아오기
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        Member findMember = principalDetails.member();
        log.info("Join에서 불러온 사용자 정보: {}", findMember.getMemberId());

        ChatRoom findChatRoom = chatRoomRepository.findById(chatRoomJoinRequest.getChatRoomId())
                .orElseThrow(() -> new CustomException(CustomExceptionType.CHAT_ROOM_NOT_FOUND));

        findMember.getChatRooms().size(); // 지연 로딩 컬렉션 초기화

        findMember.getChatRooms().add(findChatRoom);
        findChatRoom.getMembers().add(findMember);

        memberRepository.save(findMember);
        chatRoomRepository.save(findChatRoom);

        return findChatRoom.getChatRoomId() + "번 채팅방에" + findMember.getMemberName() + "님이 참가하였습니다.";
    }
}
