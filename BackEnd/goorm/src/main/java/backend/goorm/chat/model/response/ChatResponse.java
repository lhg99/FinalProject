package backend.goorm.chat.model.response;

import backend.goorm.chat.model.entity.Chat;
import backend.goorm.chat.model.entity.enums.ChatType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class ChatResponse {
    private Long id;
    private String sender;
    private String message;
    private LocalDateTime sendTime;
    private ChatType chatType;

    public static ChatResponse changeResponse(Chat chat) {
        return new ChatResponse(
                chat.getChatId(),
                chat.getSender(),
                chat.getMessage(),
                chat.getSendDate(),
                chat.getChatType()
        );
    }
}
