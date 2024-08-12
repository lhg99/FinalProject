package backend.goorm.member.model.entity;

import backend.goorm.member.model.enums.Gender;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "MEMBER_INFO")
@Entity
public class MemberInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberInfoId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID", nullable = false)
    private Member memberId;

    private Float memberHeight;

    private Float memberWeight;

    private String comment;

    private Integer memberAge;

    @Enumerated(EnumType.STRING)
    private Gender memberGender;

}
