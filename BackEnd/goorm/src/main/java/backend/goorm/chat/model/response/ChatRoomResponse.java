package backend.goorm.chat.model.response;

import backend.goorm.chat.model.entity.ChatRoom;
import backend.goorm.chat.model.entity.enums.ChatRoomType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatRoomResponse {
    private Long chatRoomId;
    private String chatRoomName;
    private ChatRoomType chatRoomType;

    public static ChatRoomResponse changeResponse(ChatRoom chatRoom) {
        return new ChatRoomResponse(
                chatRoom.getChatRoomId(),
                chatRoom.getChatRoomName(),
                chatRoom.getChatRoomType()
        );
    }
}
