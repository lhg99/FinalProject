package backend.goorm.chat.model.request;

import backend.goorm.chat.model.entity.enums.ChatType;
import lombok.Data;

@Data
public class ChatRequest {
    private String sender;
    private String message;
    private ChatType chatType;

}
