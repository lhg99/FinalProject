package backend.goorm.board.controller;

import backend.goorm.board.model.dto.request.CommentSaveRequest;
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

    @PostMapping("/save")
    public ResponseEntity saveComment(@RequestBody CommentSaveRequest commentSaveRequest, Authentication authentication){

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        commentService.saveComment(commentSaveRequest, principalDetails.member());


        return ResponseEntity.ok("저장 완료");
    }

    @GetMapping("/list/{boardId}")
    public ResponseEntity listComments(@PathVariable Long boardId){

        CommentListResponse commentListResponse = commentService.getCommentList(boardId);

        return ResponseEntity.ok(commentListResponse);
    }
}
