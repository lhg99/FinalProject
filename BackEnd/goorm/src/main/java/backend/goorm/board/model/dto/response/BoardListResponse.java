package backend.goorm.board.model.dto.response;

import backend.goorm.board.model.dto.BoardListItem;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BoardListResponse {
    List<BoardListItem> boardItems;
    int totalPages;
    int pageSize;
    Long totalCnt;
}
