package backend.goorm.board.model.entity;

import backend.goorm.member.model.entity.Member;
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
@Table(name = "BOARD")
@Entity
public class Board {

    @Id
    @GeneratedValue
    private Long boardId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID", nullable = false)
    private Member memberId;

    @Size(max = 100)
    @NotBlank
    private String boardTitle;

    @NotBlank
    private String boardContent;

    private LocalDateTime boardRegDate;

    private boolean boardDeleted = false;

}
