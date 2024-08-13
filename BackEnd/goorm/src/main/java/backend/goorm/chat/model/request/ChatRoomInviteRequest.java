package backend.goorm.chat.model.request;

import lombok.Data;

@Data
public class ChatRoomInviteRequest {
    private String receiverName;
}
