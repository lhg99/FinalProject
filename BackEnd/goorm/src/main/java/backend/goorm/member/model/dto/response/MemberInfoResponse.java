package backend.goorm.member.model.dto.response;

import backend.goorm.member.model.enums.MemberType;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberInfoResponse {

    private String memberName;
    private String memberEmail;
    private String memberNickname;
    private String memberRegDate;
    private Float memberHeight;
    private Float memberWeight;
    private String comment;
    private MemberType memberType;

}
