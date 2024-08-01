package backend.goorm.board.service;

import backend.goorm.board.model.dto.request.BoardSaveRequest;
import backend.goorm.board.model.dto.request.BoardUpdateRequest;
import backend.goorm.board.model.dto.response.BoardDetailResponse;
import backend.goorm.board.model.dto.response.BoardListResponse;
import backend.goorm.board.model.enums.BoardCategory;
import backend.goorm.board.model.enums.BoardSortType;
import backend.goorm.board.model.enums.BoardType;
import backend.goorm.member.model.entity.Member;


import java.util.List;

public interface BoardService {
    void saveBoard(BoardSaveRequest saveRequest, Member member);

    BoardListResponse getBoardList(BoardType type, int page, BoardSortType sortType, List<BoardCategory> categories, String keyword);

    BoardDetailResponse getBoardDetail(Long number, Member member);

    void deleteBoard(Long boardId, Member member);

    void updateBoard(BoardUpdateRequest updateRequest, Member member);

    String toggleLike(Long boardId, Member member);
}
