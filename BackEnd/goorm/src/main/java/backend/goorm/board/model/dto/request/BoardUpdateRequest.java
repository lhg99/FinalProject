package backend.goorm.board.model.dto.request;

import backend.goorm.board.model.enums.BoardCategory;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BoardUpdateRequest {

    private Long boardId;

    private String boardTitle;

    @Lob
    private String boardContent;

    private BoardCategory boardCategory;

    //List<String> updateImageUrls;

}
