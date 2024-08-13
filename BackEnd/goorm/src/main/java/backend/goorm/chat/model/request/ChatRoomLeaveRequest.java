package backend.goorm.chat.model.request;

import lombok.Data;

@Data
public class ChatRoomLeaveRequest {
    private Long chatRoomId;
}
