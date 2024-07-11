package backend.goorm.member.model.entity;

import backend.goorm.member.model.enums.MemberRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "MEMBER")
@Entity
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberId;

    @Size(max = 50)
    private String loginId;

    @Size(max = 255)
    private String loginPw;

    @Size(max = 20)
    @NotBlank
    private String memberName;

    @Size(max = 50)
    @NotBlank
    private String memberEmail;

    @Size(max = 20)
    @NotBlank
    private String memberNickname;

    @Size(max = 50)
    @NotBlank
    private String memberPhone;

    @Enumerated(EnumType.STRING)
    @NotBlank
    private MemberRole memberRole;

    private LocalDateTime memberRegDate;

    private boolean memberInactive = false;
}
