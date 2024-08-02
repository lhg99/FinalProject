package backend.goorm.board.service;

import backend.goorm.board.model.dto.BoardListItem;
import backend.goorm.board.model.dto.request.BoardSaveRequest;
import backend.goorm.board.model.dto.request.BoardUpdateRequest;
import backend.goorm.board.model.dto.response.BoardDetailResponse;
import backend.goorm.board.model.dto.response.BoardListResponse;
import backend.goorm.board.model.entity.Board;
import backend.goorm.board.model.entity.BoardImages;
import backend.goorm.board.model.entity.BoardLikes;
import backend.goorm.board.model.enums.BoardCategory;
import backend.goorm.board.model.enums.BoardSortType;
import backend.goorm.board.model.enums.BoardType;
import backend.goorm.board.repository.*;
import backend.goorm.common.exception.CustomException;
import backend.goorm.common.exception.CustomExceptionType;
import backend.goorm.common.util.DateConvertUtil;
import backend.goorm.member.model.entity.Member;
import backend.goorm.s3.service.S3ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final CustomBoardRepository customBoardRepository;
    private final BoardLikesRepository boardLikesRepository;
    private final BoardImageRepository boardImageRepository;

    private final DateConvertUtil dateConvertUtil;
    private final S3ImageService s3ImageService;

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
                .boardWriter(member.getMemberNickname())
                .boardTitle(saveRequest.getBoardTitle())
                .boardContent(saveRequest.getBoardContent())
                .boardRegDate(LocalDateTime.now())
                .boardDeleted(false)
                .reportsCnt(0)
                .viewCnt(0)
                .likesCnt(0)
                .boardType(saveRequest.getBoardType())
                .boardCategory(saveRequest.getBoardCategory())
                .build();

        Board saveBoard = boardRepository.save(board);
        //saveImage(saveRequest.getImageUrls(), saveBoard.getBoardId());

    }


    @Override
    public BoardListResponse getBoardList(BoardType type, int page, BoardSortType sortType, List<BoardCategory> categories, String keyword) {

        Pageable pageable = PageRequest.of(page, pageSize);
        Page<Board> boards = customBoardRepository.getBoardList(type, categories, sortType, keyword, pageable);

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
    @Transactional
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
        board.increaseViewCnt();  // 조회수 증

        List<String> imageUrls = boardImageRepository.findImageUrlsByBoardId(board.getBoardId());

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
                .imageUrls(imageUrls)
                .build();


        return detailResponse;
    }

    @Override
    @Transactional
    public void deleteBoard(Long boardId, Member member) {

        Optional<Board> findBoard = boardRepository.findBoardByIdAndNotDeleted(boardId);

        if(!findBoard.isPresent()) {
            throw new CustomException(CustomExceptionType.BOARD_NOT_FOUND);
        }

        if(findBoard.get().isBoardDeleted()){
            throw new CustomException(CustomExceptionType.ALREADY_DELETED_BOARD);
        }

        if(findBoard.get().getMemberId().getMemberId() != member.getMemberId()){
            throw new CustomException(CustomExceptionType.NO_AUTHORITY_TO_DELETE);
        }

        findBoard.get().setBoardDeleted(true);
    }

    @Override
    @Transactional
    public void updateBoard(BoardUpdateRequest updateRequest, Member member) {

        Optional<Board> findBoard = boardRepository.findBoardByIdAndNotDeleted(updateRequest.getBoardId());


        if(!findBoard.isPresent()) {
            throw new CustomException(CustomExceptionType.BOARD_NOT_FOUND);
        }

        if(findBoard.get().isBoardDeleted()){
            throw new CustomException(CustomExceptionType.ALREADY_DELETED_BOARD);
        }

        if(findBoard.get().getMemberId().getMemberId() != member.getMemberId()){
            throw new CustomException(CustomExceptionType.NO_AUTHORITY_TO_UPDATE);
        }

        //List<String> findImageUrls = boardImageRepository.findImageUrlsByBoardId(updateRequest.getBoardId());

//        for(String addr : findImageUrls){
//
//            s3ImageService.deleteImageFromS3(addr);
//        }

        //boardImageRepository.deleteByBoardId(updateRequest.getBoardId());

        //saveImage(updateRequest.getUpdateImageUrls(), updateRequest.getBoardId());

        findBoard.get().updateBoard(updateRequest);
    }

    @Override
    @Transactional
    public String toggleLike(Long boardId, Member member) {

        Optional<BoardLikes> boardLike = boardLikesRepository.findByBoardIdAndMemberId(boardId, member.getMemberId());
        Optional<Board> findBoard = boardRepository.findBoardByIdAndNotDeleted(boardId);

        String message = "";
        if(!boardLike.isPresent()) {

            boardLikesRepository.save(BoardLikes.builder()
                            .boardId(boardId)
                            .memberId(member.getMemberId())
                            .build());
            message = "좋아요 처리 되었습니다";
            findBoard.get().increaseLikesCnt();
        }else{
            boardLikesRepository.delete(boardLike.get());
            message = "좋아요가 해제되었습니다";
            findBoard.get().decreaseLikesCnt();
        }

        return message;
    }

    /**
     * Board 엔티티를 BoardListItem DTO 로 변환시키기 위한 메소드
     * @param board
     * @return
     */
    private BoardListItem convertToBoardListItem(Board board) {


        return BoardListItem.builder()
                .boardId(board.getBoardId())
                .writer(board.getBoardWriter())
                .boardTitle(board.getBoardTitle())
                .boardRegDate(dateConvertUtil.convertDateToString(board.getBoardRegDate()))
                .boardCategory(board.getBoardCategory())
                .boardType(board.getBoardType())
                .viewCnt(board.getViewCnt())
                .likeCnt(board.getLikesCnt())
                .build();
    }

    public void saveImage(List<String> imageUrls, Long boardId) {
        if(imageUrls == null || imageUrls.isEmpty()) {
            return;
        }

        for(String url : imageUrls){
            BoardImages boardImage = BoardImages.builder()
                    .boardId(boardId)
                    .imageUrl(url)
                    .build();
            boardImageRepository.save(boardImage);
        }
    }
}
