package backend.goorm.chat.model.request;

import lombok.Data;

@Data
public class ChatRoomJoinRequest {
    private String loginId;
    private Long chatRoomId;
}
