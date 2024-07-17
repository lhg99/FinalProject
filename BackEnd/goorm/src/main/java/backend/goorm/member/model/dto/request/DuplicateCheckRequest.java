package backend.goorm.member.model.dto.request;

import backend.goorm.member.model.enums.DuplicateCheckType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DuplicateCheckRequest {

    DuplicateCheckType checkType;
    String checkValue;

}
