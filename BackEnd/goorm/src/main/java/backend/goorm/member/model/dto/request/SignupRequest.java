package backend.goorm.member.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequest {

    private String loginId;
    private String loginPw;
    private String name;
    private String email;
    private String nickname;
    private String phone;

}
