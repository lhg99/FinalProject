package backend.goorm.board.repository;

import backend.goorm.board.model.entity.Board;
import backend.goorm.board.model.enums.BoardCategory;
import backend.goorm.board.model.enums.BoardSortType;
import backend.goorm.board.model.enums.BoardType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomBoardRepository {
    Page<Board> getBoardList(BoardType type, List<BoardCategory> categories, BoardSortType sortType, String keyword, Pageable pageable);
}
