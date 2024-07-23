package backend.goorm.board.model.entity;

import backend.goorm.board.model.enums.BoardCategory;
import backend.goorm.board.model.enums.BoardType;
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


    @Column(length = 100, nullable = false)
    private String boardTitle;

    @Column(nullable = false)
    private String boardContent;

    @Column(nullable = false)
    private LocalDateTime boardRegDate;

    private boolean boardDeleted = false;

    private int viewCnt;

    private int likesCnt;

    private int reportsCnt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    BoardType boardType;

    @Enumerated(EnumType.STRING)
    BoardCategory boardCategory;

}
