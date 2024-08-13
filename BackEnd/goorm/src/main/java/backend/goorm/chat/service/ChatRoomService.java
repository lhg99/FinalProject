package backend.goorm.chat.service;

import backend.goorm.chat.model.entity.ChatRoom;
import backend.goorm.chat.model.entity.enums.ChatRoomStatus;
import backend.goorm.chat.model.entity.enums.ChatRoomType;
import backend.goorm.chat.model.request.ChatRoomInviteRequest;
import backend.goorm.chat.model.request.ChatRoomJoinRequest;
import backend.goorm.chat.model.request.ChatRoomLeaveRequest;
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
import java.util.Optional;
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

    //1:1 채팅방 목록 조회
    public List<ChatRoomResponse> getPrivateChatRoomsByLoginId(String loginId, Authentication authentication) {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        Member findMember = principalDetails.member();

        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new CustomException(CustomExceptionType.CHAT_ROOM_NOT_FOUND));

        return findMember.getChatRooms()
                .stream()
                .filter(chatRoom -> chatRoom.getChatRoomType() == ChatRoomType.PRIVATE)
                .map(ChatRoomResponse::changeResponse)
                .collect(Collectors.toList());
    }

    //loginId로 오픈채팅방 목록 조회
    public List<ChatRoomResponse> getPublicChatRoomsByLoginId(String loginId, Authentication authentication) {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        Member findMember = principalDetails.member();

        Member member = memberRepository.findByLoginId(findMember.getLoginId())
                .orElseThrow(() -> new CustomException(CustomExceptionType.CHAT_ROOM_NOT_FOUND));


        return member.getChatRooms()
                .stream()
                .filter(chatRoom -> chatRoom.getChatRoomType() == ChatRoomType.PUBLIC)
                .map(ChatRoomResponse::changeResponse)
                .collect(Collectors.toList());
    }

    //참여하지 않은 오픈채팅방 조회
    public List<ChatRoomResponse> getPublicChatRooms(String loginId, Authentication authentication) {
        List<ChatRoom> findAllChatRooms = chatRoomRepository.findAll();
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        Member findMember = principalDetails.member();

//        Member member = memberRepository.findByLoginId(loginId)
//                .orElseThrow(() -> new CustomException(CustomExceptionType.USER_NOT_FOUND));

        return findAllChatRooms
                .stream()
                .filter(chatRoom -> chatRoom.getChatRoomType() == ChatRoomType.PUBLIC)
                .filter(chatRoom -> chatRoom.getMembers().stream()
                        .noneMatch(member -> member.getMemberId().equals(findMember.getMemberId()))) // or use loginId
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

    //채팅방 초대
    public void inviteChatRoom(ChatRoomInviteRequest chatRoomInviteRequest, Authentication authentication) {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        Member sender = principalDetails.member();

        log.info("receiverNickname: {}", chatRoomInviteRequest.getReceiverName());

        Member receiver = memberRepository.findByMemberNickname(chatRoomInviteRequest.getReceiverName())
                .orElseThrow(() -> new CustomException(CustomExceptionType.USER_NOT_FOUND));

        // 지연 로딩 컬렉션 초기화
        sender.getChatRooms().size();
        receiver.getChatRooms().size();

        // 채팅방 참여 여부 확인 (추가)
        if (receiver.getChatRooms().stream()
                .filter(room -> room.getChatRoomType() == ChatRoomType.PRIVATE)
                .anyMatch(room -> room.getMembers().stream()
                        .anyMatch(member -> member.getMemberId().equals(sender.getMemberId())))) {
            throw new CustomException(CustomExceptionType.ALREADY_IN_CHAT_ROOM);
        }

        // Sender와 Receiver가 동일한 경우 오류 반환
        if (sender.getMemberId().equals(receiver.getMemberId())) {
            throw new CustomException(CustomExceptionType.ALREADY_IN_CHAT_ROOM);
        }


        // 채팅방 생성
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setChatRoomName(receiver.getMemberNickname() + "님과의 채팅");
        chatRoom.setChatRoomType(ChatRoomType.PRIVATE);
        chatRoom.setChatRoomStatus(ChatRoomStatus.ACTIVE);
        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);

        // 채팅방 참여
        savedChatRoom.getMembers().add(sender);
        sender.getChatRooms().add(savedChatRoom);
        savedChatRoom.getMembers().add(receiver);
        receiver.getChatRooms().add(savedChatRoom);

        // 변경 사항을 영속성 컨텍스트에 반영
        chatRoomRepository.save(savedChatRoom);
        memberRepository.save(sender);
        memberRepository.save(receiver);

        // 로그를 추가하여 문제를 추적
        log.info("채팅방 생성 및 참여 완료 - 채팅방 ID: {}", savedChatRoom.getChatRoomId());
        log.info("sender 채팅방 목록: {}", sender.getChatRooms().stream().map(ChatRoom::getChatRoomName).collect(Collectors.toList()));
        log.info("receiver 채팅방 목록: {}", receiver.getChatRooms().stream().map(ChatRoom::getChatRoomName).collect(Collectors.toList()));
    }


    //채팅방 나가기
    public void leaveChatRoom(ChatRoomLeaveRequest chatRoomLeaveRequest, Authentication authentication) {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        Member sender = principalDetails.member();

        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomLeaveRequest.getChatRoomId())
                .orElseThrow(() -> new CustomException(CustomExceptionType.CHAT_ROOM_NOT_FOUND));

        boolean isMemberInChatRoom = chatRoom.getMembers().stream()
                .anyMatch(member -> member.getMemberId().equals(sender.getMemberId()));

        if (!isMemberInChatRoom) {
            throw new RuntimeException("사용자가 이 채팅방에 속해있지 않습니다.");
        }

        // 채팅방에서 사용자 제거
        chatRoom.getMembers().removeIf(member -> member.getMemberId().equals(sender.getMemberId()));
        sender.getChatRooms().removeIf(room -> room.getChatRoomId().equals(chatRoom.getChatRoomId()));


        // 변경된 상태 저장
        chatRoomRepository.save(chatRoom);
        memberRepository.save(sender);

//        // 만약 채팅방에 멤버가 더 이상 없다면 채팅방을 삭제하거나 상태를 업데이트
//        if (chatRoom.getMembers().isEmpty()) {
//            chatRoomRepository.delete(chatRoom);
//        }
    }
}
