package backend.goorm.board.model.dto.response;

import backend.goorm.board.model.dto.BoardTrainingRecordItem;
import backend.goorm.board.model.enums.BoardCategory;
import backend.goorm.board.model.enums.BoardType;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BoardDetailResponse {

    private Long boardId;

    private String writer;

    private String boardTitle;

    private String boardContent;

    private String boardRegDate;

    private int viewCnt;

    private int likesCnt;

    private int reportsCnt;

    private boolean isLikes;

    private BoardType boardType;

    private BoardCategory boardCategory;

    List<BoardTrainingRecordItem> trainingRecordItems;

    //List<String> imageUrls;

}
