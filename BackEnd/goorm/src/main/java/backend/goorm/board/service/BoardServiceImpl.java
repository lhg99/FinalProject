package backend.goorm.board.service;

import backend.goorm.board.model.dto.BoardListItem;
import backend.goorm.board.model.dto.request.BoardSaveRequest;
import backend.goorm.board.model.dto.response.BoardListResponse;
import backend.goorm.board.model.entity.Board;
import backend.goorm.board.model.enums.BoardCategory;
import backend.goorm.board.model.enums.BoardSortType;
import backend.goorm.board.model.enums.BoardType;
import backend.goorm.board.repository.BoardRepository;
import backend.goorm.board.repository.CustomBoardRepository;
import backend.goorm.member.model.entity.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final CustomBoardRepository customBoardRepository;

    @Value("${board.page.size}")
    private int pageSize;


    /**
     * 게시글 저장
     * @param saveRequest
     * @param member
     */
    @Override
    public void saveBoard(BoardSaveRequest saveRequest, Member member) {

        Board board = Board.builder()
                .memberId(member)
                .boardTitle(saveRequest.getBoardTitle())
                .boardContent(saveRequest.getBoardContent())
                .boardRegDate(LocalDateTime.now())
                .boardDeleted(false)
                .reportsCnt(0)
                .viewCnt(0)
                .likesCnt(9)
                .boardType(saveRequest.getBoardType())
                .boardCategory(saveRequest.getBoardCategory())
                .build();

        boardRepository.save(board);
    }

    @Override
    public BoardListResponse getBoardList(BoardType type, int page, BoardSortType sortType, List<BoardCategory> categories) {

        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<Board> boards = customBoardRepository.getBoardList(type, categories, sortType, pageable);

        List<BoardListItem> boardItems = boards.stream()
                .map(this::convertToBoardListItem)
                .collect(Collectors.toList());

        BoardListResponse boardListResponse = BoardListResponse.builder()
                .boardItems(boardItems)
                .totalCnt(boards.getTotalElements())
                .totalPages(boards.getTotalPages())
                .pageSize(boards.getSize())
                .build();

        return boardListResponse;
    }

    private BoardListItem convertToBoardListItem(Board board) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
        String regDate = board.getBoardRegDate().format(formatter);

        return BoardListItem.builder()
                .boardId(board.getBoardId())
                .writer(board.getMemberId().getMemberName())
                .boardTitle(board.getBoardTitle())
                .boardRegDate(regDate)
                .boardCategory(board.getBoardCategory())
                .boardType(board.getBoardType())
                .viewCnt(board.getViewCnt())
                .likeCnt(board.getLikesCnt())
                .build();
    }
}
