package backend.goorm.board.service;

import backend.goorm.board.model.dto.CommentListItem;
import backend.goorm.board.model.dto.request.CommentSaveRequest;
import backend.goorm.board.model.dto.request.CommentUpdateRequest;
import backend.goorm.board.model.dto.response.CommentListResponse;
import backend.goorm.board.model.entity.Board;
import backend.goorm.board.model.entity.Comment;
import backend.goorm.board.repository.BoardRepository;
import backend.goorm.board.repository.CommentRepository;
import backend.goorm.common.exception.CustomException;
import backend.goorm.common.exception.CustomExceptionType;
import backend.goorm.common.util.DateConvertUtil;
import backend.goorm.member.model.entity.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;
    private final DateConvertUtil dateConvertUtil;

    @Override
    @Transactional
    public void saveComment(CommentSaveRequest commentSaveRequest, Member member) {

        Optional<Board> findBoard = boardRepository.findBoardByIdAndNotDeleted(commentSaveRequest.getBoardId());

        if(!findBoard.isPresent()) {
            throw new CustomException(CustomExceptionType.BOARD_NOT_FOUND);
        }

        if(findBoard.get().isBoardDeleted()){
            throw new CustomException(CustomExceptionType.ALREADY_DELETED_BOARD);
        }

        findBoard.get().addCommentTexts(commentSaveRequest.getCommentContent());

        Comment comment = Comment.builder()
                .boardId(findBoard.get())
                .memberId(member)
                .commentContent(commentSaveRequest.getCommentContent())
                .commentRegDate(LocalDateTime.now())
                .commentDeleted(false)
                .build();

        commentRepository.save(comment);
    }

    @Override
    public CommentListResponse getCommentList(Long boardId) {

        Optional<Board> findBoard = boardRepository.findBoardByIdAndNotDeleted(boardId);

        if(!findBoard.isPresent()) {
            throw new CustomException(CustomExceptionType.BOARD_NOT_FOUND);
        }

        if(findBoard.get().isBoardDeleted()){
            throw new CustomException(CustomExceptionType.ALREADY_DELETED_BOARD);
        }

        List<Comment> commentList = commentRepository.findByBoardAndNotDeleted(findBoard.get());

        List<CommentListItem> collect = commentList.stream().map(this::convertToCommentListItem).collect(Collectors.toList());

        return CommentListResponse.builder()
                .comments(collect)
                .totalCnt(collect.size())
                .build();
    }

    @Override
    @Transactional
    public void updateComment(CommentUpdateRequest updateCommentRequest, Member member) {

        Optional<Comment> findComment = commentRepository.findByCommentId(updateCommentRequest.getCommentId());

        if(!findComment.isPresent()) {
            throw new CustomException(CustomExceptionType.COMMENT_NOT_FOUND);
        }

        if(member.getMemberId() != findComment.get().getMemberId().getMemberId()){
            throw new CustomException(CustomExceptionType.NO_AUTHORITY_TO_UPDATE);
        }

        if(findComment.get().isCommentDeleted()){
            throw new CustomException(CustomExceptionType.COMMENT_DELETED_BOARD);
        }

        findComment.get().updateComment(updateCommentRequest);

    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, Member member) {

        Optional<Comment> findComment = commentRepository.findByCommentId(commentId);

        if(!findComment.isPresent()) {
            throw new CustomException(CustomExceptionType.COMMENT_NOT_FOUND);
        }

        if(member.getMemberId() != findComment.get().getMemberId().getMemberId()){
            throw new CustomException(CustomExceptionType.NO_AUTHORITY_TO_DELETE);
        }

        if(findComment.get().isCommentDeleted()){
            throw new CustomException(CustomExceptionType.COMMENT_DELETED_BOARD);
        }

        findComment.get().deleteComment();

    }

    private CommentListItem convertToCommentListItem(Comment comment) {
        return CommentListItem.builder()
                .commentId(comment.getCommentId())
                .writerId(comment.getMemberId().getMemberId())
                .writer(comment.getMemberId().getMemberNickname()) // assuming getName() method exists in Member entity
                .commentRegDate(dateConvertUtil.convertDateToStringWithTime(comment.getCommentRegDate()))
                .commentContent(comment.getCommentContent())
                .build();
    }
}
