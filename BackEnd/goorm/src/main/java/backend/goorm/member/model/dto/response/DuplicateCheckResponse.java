package backend.goorm.member.model.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DuplicateCheckResponse {

    String message;
    boolean usable;
}
