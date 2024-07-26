package backend.goorm.board.model.dto.response;

import backend.goorm.board.model.dto.CommentListItem;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentListResponse {

    List<CommentListItem> comments;
    int totalCnt;

}
