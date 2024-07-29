package backend.goorm.board.service;

import backend.goorm.board.model.dto.request.CommentSaveRequest;
import backend.goorm.board.model.dto.request.CommentUpdateRequest;
import backend.goorm.board.model.dto.response.CommentListResponse;
import backend.goorm.member.model.entity.Member;

public interface CommentService {
    void saveComment(CommentSaveRequest commentSaveRequest, Member member);

    CommentListResponse getCommentList(Long boardId);

    void updateComment(CommentUpdateRequest updateCommentRequest, Member member);

    void deleteComment(Long commentId, Member member);
}
