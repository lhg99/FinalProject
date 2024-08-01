package backend.goorm.board.controller;

import backend.goorm.board.model.dto.request.BoardSaveRequest;
import backend.goorm.board.model.dto.BoardListItem;
import backend.goorm.board.model.dto.request.BoardUpdateRequest;
import backend.goorm.board.model.dto.request.CommentSaveRequest;
import backend.goorm.board.model.dto.response.BoardDetailResponse;
import backend.goorm.board.model.dto.response.BoardListResponse;
import backend.goorm.board.model.enums.BoardCategory;
import backend.goorm.board.model.enums.BoardSortType;
import backend.goorm.board.model.enums.BoardType;
import backend.goorm.board.service.BoardService;
import backend.goorm.member.oauth.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
@Slf4j
public class BoardController {

    private final BoardService boardService;

    /**
     * 게시글 등록
     * @param saveRequest
     * @param authentication
     * @return
     */
    @PostMapping("/save")
    public ResponseEntity saveBoard(@RequestBody BoardSaveRequest saveRequest, Authentication authentication){

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        boardService.saveBoard(saveRequest, principalDetails.member());

        return ResponseEntity.ok("게시글 등록 완료");
    }

    /**
     * 게시글 목록 조회
     * @param page
     * @param boardType
     * @param sortType
     * @param categories
     * @return
     */
    @GetMapping("/list/{page}")
    public ResponseEntity getBoardList(@PathVariable int page,
                                       @RequestParam BoardType boardType,
                                       @RequestParam(defaultValue = "DATE_DESC")BoardSortType sortType,
                                       @RequestParam(defaultValue = "")List<BoardCategory> categories,
                                       @RequestParam(defaultValue = "")String keyword){

        BoardListResponse boardList = boardService.getBoardList(boardType, page, sortType, categories, keyword);

        return ResponseEntity.ok(boardList);
    }

    @GetMapping("/detail/{number}")
    public ResponseEntity getBoardDetail(@PathVariable Long number, Authentication authentication){

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        BoardDetailResponse detailResponse = boardService.getBoardDetail(number, principalDetails.member());

        return ResponseEntity.ok(detailResponse);
    }

    @PostMapping("/delete/{boardId}")
    public ResponseEntity deleteBoard(@PathVariable Long boardId, Authentication authentication){

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        boardService.deleteBoard(boardId, principalDetails.member());

        return ResponseEntity.ok("삭제 완료");
    }

    @PostMapping("/update")
    public ResponseEntity updateBoard(@RequestBody BoardUpdateRequest updateRequest, Authentication authentication){
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        boardService.updateBoard(updateRequest, principalDetails.member());

        return ResponseEntity.ok("수정 완료");
    }

    @PostMapping("/toggle/like/{boardId}")
    public ResponseEntity toggleLike(@PathVariable Long boardId, Authentication authentication){

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        String message = boardService.toggleLike(boardId, principalDetails.member());

        return ResponseEntity.ok(message);
    }


}
