package backend.goorm.board.controller;

import backend.goorm.board.model.dto.request.CommentSaveRequest;
import backend.goorm.board.model.dto.request.CommentUpdateRequest;
import backend.goorm.board.model.dto.response.CommentListResponse;
import backend.goorm.board.service.CommentService;
import backend.goorm.member.oauth.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RequestMapping("api/comment")
@RestController
@Slf4j
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    /**
     * 댓글 저장
     * @param commentSaveRequest
     * @param authentication
     * @return
     */
    @PostMapping("/save")
    public ResponseEntity saveComment(@RequestBody CommentSaveRequest commentSaveRequest, Authentication authentication){

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        commentService.saveComment(commentSaveRequest, principalDetails.member());


        return ResponseEntity.ok("저장 완료");
    }

    /**
     * 댓글 리스트 불러오기
     * @param boardId
     * @return
     */
    @GetMapping("/list/{boardId}")
    public ResponseEntity listComments(@PathVariable Long boardId){

        CommentListResponse commentListResponse = commentService.getCommentList(boardId);

        return ResponseEntity.ok(commentListResponse);
    }

    @PostMapping("/delete/{commentId}")
    public ResponseEntity deleteComment(@PathVariable Long commentId,  Authentication authentication){

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        commentService.deleteComment(commentId, principalDetails.member());

        return ResponseEntity.ok("삭제가 완료되었습니다");
    }


    @PostMapping("/update")
    public ResponseEntity updateComment(@RequestBody CommentUpdateRequest updateCommentRequest, Authentication authentication){

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        commentService.updateComment(updateCommentRequest, principalDetails.member());

        return ResponseEntity.ok("수정이 완료되었습니다");
    }

}
