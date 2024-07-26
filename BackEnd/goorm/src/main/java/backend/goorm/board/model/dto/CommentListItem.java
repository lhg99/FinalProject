package backend.goorm.board.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentListItem {

    private Long commentId;

    private Long writerId;

    private String writer;

    private String commentRegDate;

    private String commentContent;
}
