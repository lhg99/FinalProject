package backend.goorm.record.controller;

import backend.goorm.member.oauth.PrincipalDetails;
import backend.goorm.record.entity.Record;
import backend.goorm.record.service.BodyPartCountRecordService;
import backend.goorm.training.model.enums.TrainingCategoryType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bodyPartCount")
@RequiredArgsConstructor
public class BodyPartCountRecordController {

    private final BodyPartCountRecordService bodyPartCountRecordService;

    @GetMapping("/today")
    public ResponseEntity<Map<TrainingCategoryType, BodyPartCountRecordService.BodyPartCountInfo>> getBodyPartCountForToday(
            @AuthenticationPrincipal PrincipalDetails principalDetails) {
        LocalDate today = LocalDate.now();
        List<Record> records = bodyPartCountRecordService.getRecordsByDate(today, principalDetails.member());
        Map<TrainingCategoryType, BodyPartCountRecordService.BodyPartCountInfo> bodyPartCounts = bodyPartCountRecordService.getBodyPartCountInfoMap(records);
        return ResponseEntity.ok(bodyPartCounts);
    }

    @GetMapping("/range")
    public ResponseEntity<Map<TrainingCategoryType, BodyPartCountRecordService.BodyPartCountInfo>> getBodyPartCountByDateRange(
            @RequestParam("startDate") LocalDate start,
            @RequestParam("endDate") LocalDate end,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {
        List<Record> records = bodyPartCountRecordService.getRecordsByDateRange(start, end, principalDetails.member());
        Map<TrainingCategoryType, BodyPartCountRecordService.BodyPartCountInfo> bodyPartCounts = bodyPartCountRecordService.getBodyPartCountInfoMap(records);
        return ResponseEntity.ok(bodyPartCounts);
    }
}
