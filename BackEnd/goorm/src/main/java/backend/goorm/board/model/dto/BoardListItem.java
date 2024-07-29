package backend.goorm.board.model.dto;

import backend.goorm.board.model.enums.BoardCategory;
import backend.goorm.board.model.enums.BoardType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardListItem {

    private Long boardId;

    private String writer;

    private String boardTitle;

    private String boardRegDate;

    private BoardType boardType;

    private BoardCategory boardCategory;

    private int viewCnt;

    private int likeCnt;

}
