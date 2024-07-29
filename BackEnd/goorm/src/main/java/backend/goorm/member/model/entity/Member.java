package backend.goorm.member.model.entity;

import backend.goorm.chat.model.entity.ChatRoom;
import backend.goorm.member.model.enums.MemberRole;
import backend.goorm.member.model.enums.MemberType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.util.List;

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

    @Enumerated(EnumType.STRING)
    private MemberRole role;

    private LocalDateTime memberRegDate;

    private boolean memberInactive = false;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "member_chat_room",
            joinColumns = @JoinColumn(name = "member_id"),
            inverseJoinColumns = @JoinColumn(name = "chat_room_id")
    )
    private List<ChatRoom> chatRooms;

    // 회원가입 진행 여부
    private boolean memberRegistered = false;

    @Size(max = 50)
    private String socialId;

    @Enumerated(EnumType.STRING)
    private MemberType memberType;

}
