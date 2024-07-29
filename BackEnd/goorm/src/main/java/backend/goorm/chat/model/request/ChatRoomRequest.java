package backend.goorm.chat.model.request;

import backend.goorm.chat.model.entity.enums.ChatRoomType;
import lombok.Data;

@Data
public class ChatRoomRequest {
    private String chatRoomName;
    private ChatRoomType chatRoomType;
}
