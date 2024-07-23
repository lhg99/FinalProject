package backend.goorm.board.service;

import backend.goorm.board.model.dto.BoardListItem;
import backend.goorm.board.model.dto.request.BoardSaveRequest;
import backend.goorm.board.model.dto.response.BoardDetailResponse;
import backend.goorm.board.model.dto.response.BoardListResponse;
import backend.goorm.board.model.entity.Board;
import backend.goorm.board.model.entity.BoardLikes;
import backend.goorm.board.model.enums.BoardCategory;
import backend.goorm.board.model.enums.BoardSortType;
import backend.goorm.board.model.enums.BoardType;
import backend.goorm.board.repository.BoardLikesRepository;
import backend.goorm.board.repository.BoardRepository;
import backend.goorm.board.repository.CommentRepository;
import backend.goorm.board.repository.CustomBoardRepository;
import backend.goorm.common.exception.CustomException;
import backend.goorm.common.exception.CustomExceptionType;
import backend.goorm.common.util.DateConvertUtil;
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
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final CustomBoardRepository customBoardRepository;
    private final CommentRepository commentRepository;
    private final BoardLikesRepository boardLikesRepository;

    private final DateConvertUtil dateConvertUtil;

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

    @Override
    public BoardDetailResponse getBoardDetail(Long boardId, Member member) {


        Optional<Board> findBoard = boardRepository.findBoardByIdAndNotDeleted(boardId);
        Optional<BoardLikes> findLikes = boardLikesRepository.findByBoardIdAndMemberId(boardId, member.getMemberId());

        /**
         * 게시글이 존재하지 않는다면 예외처리
         */
        if(!findBoard.isPresent()) {
            throw new CustomException(CustomExceptionType.BOARD_NOT_FOUND);
        }

        /**
         * 삭제된 게시글이라면 예외처리
         */
        if(findBoard.get().isBoardDeleted()){
            throw new CustomException(CustomExceptionType.ALREADY_DELETED_BOARD);
        }

        Board board = findBoard.get();

        BoardDetailResponse detailResponse = BoardDetailResponse.builder()
                .boardId(board.getBoardId())
                .writer(board.getMemberId().getMemberNickname())
                .boardTitle(board.getBoardTitle())
                .boardContent(board.getBoardContent())
                .boardRegDate(dateConvertUtil.convertDateToString(board.getBoardRegDate()))
                .viewCnt(board.getViewCnt())
                .likesCnt(board.getLikesCnt())
                .reportsCnt(board.getReportsCnt())
                .isLikes(findLikes.isPresent())
                .boardType(board.getBoardType())
                .boardCategory(board.getBoardCategory())
                .build();


        return detailResponse;
    }

    /**
     * Board 엔티티를 BoardListItem DTO 로 변환시키기 위한 메소드
     * @param board
     * @return
     */
    private BoardListItem convertToBoardListItem(Board board) {


        return BoardListItem.builder()
                .boardId(board.getBoardId())
                .writer(board.getMemberId().getMemberNickname())
                .boardTitle(board.getBoardTitle())
                .boardRegDate(dateConvertUtil.convertDateToString(board.getBoardRegDate()))
                .boardCategory(board.getBoardCategory())
                .boardType(board.getBoardType())
                .viewCnt(board.getViewCnt())
                .likeCnt(board.getLikesCnt())
                .build();
    }
}
