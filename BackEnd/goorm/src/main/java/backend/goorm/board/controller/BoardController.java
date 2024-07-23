package backend.goorm.board.controller;

import backend.goorm.board.model.dto.request.BoardSaveRequest;
import backend.goorm.board.model.dto.BoardListItem;
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


    @PostMapping("/save")
    public ResponseEntity saveBoard(@RequestBody BoardSaveRequest saveRequest, Authentication authentication){

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        boardService.saveBoard(saveRequest, principalDetails.member());

        return ResponseEntity.ok("게시글 등록 완료");
    }

    @GetMapping("/list/{page}")
    public ResponseEntity getBoardList(@PathVariable int page,
                                       @RequestParam BoardType type,
                                       @RequestParam(defaultValue = "DATE_DESC")BoardSortType sortType,
                                       @RequestParam(defaultValue = "")List<BoardCategory> categories){

        BoardListResponse boardList = boardService.getBoardList(type, page, sortType, categories);

        return ResponseEntity.ok(boardList);
    }



}
