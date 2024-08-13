package backend.goorm.member.model.dto.request;

import backend.goorm.member.model.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class regMemberInfoRequest {

    private Float memberHeight;
    private Float memberWeight;
    private String comment;
    private Integer memberAge;
    private Gender memberGender;

}
