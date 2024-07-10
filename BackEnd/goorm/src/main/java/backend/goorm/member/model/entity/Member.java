package backend.goorm.member.model.entity;

import backend.goorm.member.model.enums.MemberRole;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "MEMBER")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberId;

    private String loginId;

    private String loginPw;

    private String memberName;

    private String memberEmail;

    private String memberNickname;

    private String memberPhone;

    private MemberRole memberRole;

    private LocalDateTime memberRegdate;

    private boolean memberInactive;
}
