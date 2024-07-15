package backend.goorm.chat.model.response;

import backend.goorm.chat.model.entity.Chat;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ChatResponse {
    private Long id;
    private String sender;
    private String message;
    private LocalDateTime sendTime;

    public static ChatResponse changeResponse(Chat chat) {
        return new ChatResponse(
                chat.getId(),
                chat.getSender(),
                chat.getMessage(),
                chat.getSendDate()
        );
    }
}
