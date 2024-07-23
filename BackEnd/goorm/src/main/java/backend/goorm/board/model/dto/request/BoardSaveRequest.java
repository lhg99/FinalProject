package backend.goorm.board.model.dto.request;

import backend.goorm.board.model.enums.BoardCategory;
import backend.goorm.board.model.enums.BoardType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BoardSaveRequest {

    @Size(max = 100)
    @NotBlank
    private String boardTitle;

    @NotBlank
    private String boardContent;

    @NotBlank
    BoardType boardType;

    BoardCategory boardCategory;

}
