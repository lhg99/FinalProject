package backend.goorm.record.controller;

import backend.goorm.member.oauth.PrincipalDetails;
import backend.goorm.record.dto.MemoDto;
import backend.goorm.record.service.MemoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/memo")
@RequiredArgsConstructor
public class MemoController {

    private final MemoService memoService;

    @PostMapping
    public ResponseEntity<MemoDto> addOrUpdateMemo(@RequestBody MemoDto memoDto,
                                                   @AuthenticationPrincipal PrincipalDetails principalDetails) {
        MemoDto response = memoService.addOrUpdateMemo(memoDto, principalDetails.member());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<MemoDto> getMemoByDate(@AuthenticationPrincipal PrincipalDetails principalDetails) {
        LocalDate today = LocalDate.now();
        MemoDto response = memoService.getMemoByDateAndMember(today, principalDetails.member());
        return ResponseEntity.ok(response);
    }
}
