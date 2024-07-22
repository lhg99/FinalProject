package backend.goorm.member.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OauthSignupRequest {

    private Long memberId;
    private String memberName;
    private String memberPhone;

}
