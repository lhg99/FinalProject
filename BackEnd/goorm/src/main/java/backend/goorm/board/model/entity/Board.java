package backend.goorm.board.model.entity;

import backend.goorm.board.model.dto.request.BoardUpdateRequest;
import backend.goorm.board.model.enums.BoardCategory;
import backend.goorm.board.model.enums.BoardType;
import backend.goorm.member.model.entity.Member;
import jakarta.persistence.*;
import lombok.*;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long boardId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID", nullable = false)
    private Member memberId;

    private String boardWriter;

    @Column(length = 100, nullable = false)
    private String boardTitle;


    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
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

    private String boardCommentTexts;

    public void increaseViewCnt() {
        this.viewCnt++;
    }

    public void updateBoard(BoardUpdateRequest updateRequest){

        this.boardTitle = updateRequest.getBoardTitle();
        this.boardContent = updateRequest.getBoardContent();
        this.boardCategory = updateRequest.getBoardCategory();

    }

    public void increaseLikesCnt() {
        this.likesCnt++;
    }

    public void decreaseLikesCnt() {
        this.likesCnt--;
    }

    public void addCommentTexts(String commentTexts) {
        this.boardCommentTexts += commentTexts;
    }


}
