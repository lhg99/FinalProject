package backend.goorm.record.controller;

import backend.goorm.member.model.entity.Member;
import backend.goorm.member.oauth.PrincipalDetails;
import backend.goorm.record.dto.*;
import backend.goorm.record.service.RecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/record")
public class RecordController {

    private final RecordService recordService;

    @PostMapping("/training/{id}/add/cardio")
    public ResponseEntity<RecordDto> addCardioRecord(@PathVariable("id") Long trainingId,
                                                     @Valid @ModelAttribute AddCardioRecordRequest request,
                                                     @RequestParam(value = "images", required = false) MultipartFile[] images,
                                                     @AuthenticationPrincipal PrincipalDetails principalDetails) {
        RecordDto result = recordService.addCardioRecord(trainingId, request, principalDetails.member(), images);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/training/{id}/add/strength")
    public ResponseEntity<RecordDto> addStrengthRecord(@PathVariable("id") Long trainingId,
                                                       @Valid @ModelAttribute AddStrengthRecordRequest request,
                                                       @RequestParam(value = "images", required = false) MultipartFile[] images,
                                                       @AuthenticationPrincipal PrincipalDetails principalDetails) {
        RecordDto result = recordService.addStrengthRecord(trainingId, request, principalDetails.member(), images);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/edit-multiple")
    public ResponseEntity<List<RecordDto>> editRecords(
            @RequestBody List<EditRecordRequest> requests,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {

        List<RecordDto> updatedRecords = recordService.editRecords(requests, principalDetails.member());
        return ResponseEntity.ok(updatedRecords);
    }

    @DeleteMapping("/training/{id}/delete")
    public ResponseEntity<Void> deleteRecord(@PathVariable("id") Long recordId,
                                             @AuthenticationPrincipal PrincipalDetails principalDetails) {
        recordService.deleteRecord(recordId, principalDetails.member());
        return ResponseEntity.ok().build();
    }


    @GetMapping("/all/page")
    public ResponseEntity<SimplePageResponse<RecordDto>> getPagedRecords(
            @AuthenticationPrincipal PrincipalDetails principalDetails,
            @PageableDefault(size = 20) Pageable pageable) {
        // 모든 운동 기록을 조회
        Page<RecordDto> recordsPage = recordService.getPagedRecords(principalDetails.member(), pageable);

        SimplePageResponse<RecordDto> response = SimplePageResponse.<RecordDto>builder()
                .content(recordsPage.getContent())
                .totalPages(recordsPage.getTotalPages())
                .totalElements(recordsPage.getTotalElements())
                .build();

        return ResponseEntity.ok(response);
    }


    @GetMapping("/all")
    public ResponseEntity<List<RecordDto>> getAllRecords(@AuthenticationPrincipal PrincipalDetails principalDetails) {
        List<RecordDto> records = recordService.getAllRecords(principalDetails.member());
        return ResponseEntity.ok(records);
    }



    @GetMapping("/daily-summary")
    public ResponseEntity<Map<String, Integer>> getRecordSummary(
            @AuthenticationPrincipal PrincipalDetails principalDetails,
            @RequestParam(value = "date", required = false) LocalDate date) {

        // 날짜를 입력하지 않으면 오늘 날짜를 기본으로 사용
        if (date == null) {
            date = LocalDate.now();
        }

        int totalCaloriesBurned = recordService.getTotalCaloriesBurnedByDateAndMember(date, principalDetails.member());
        int totalDurationMinutes = recordService.getTotalDurationByDateAndMember(date, principalDetails.member());

        Map<String, Integer> response = new HashMap<>();
        response.put("totalCaloriesBurned", totalCaloriesBurned);
        response.put("totalDurationMinutes", totalDurationMinutes);

        return ResponseEntity.ok(response);
    }
}
