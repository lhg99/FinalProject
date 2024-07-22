//package backend.goorm.record.controller;
//
//import backend.goorm.record.dto.AddRecordRequest;
//import backend.goorm.record.dto.RecordDto;
//import backend.goorm.record.service.RecordService;
//import backend.goorm.security.PrincipalDetails;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.web.bind.annotation.*;
//
//
//import java.util.List;
//
//@Slf4j
//@RequiredArgsConstructor
//@RestController
//@RequestMapping("/record")
//public class RecordController {
//
//    private final RecordService recordService;
//
//
//    @PostMapping("/training/{id}/add")
//    public ResponseEntity<RecordDto> addRecord(@PathVariable("id") Long trainingId,
//                                               @Valid @RequestBody AddRecordRequest input,
//                                               @AuthenticationPrincipal PrincipalDetails principalDetails) {
//        RecordDto result = recordService.addRecord(trainingId, input, principalDetails.getMember());
//        return ResponseEntity.ok(result);
//    }
//
//
//    @PutMapping("/training/{id}/edit")
//    public ResponseEntity<RecordDto> editRecord(@PathVariable("id") Long trainingId,
//                                                @Valid @RequestBody AddRecordRequest input,
//                                                @AuthenticationPrincipal PrincipalDetails principalDetails) {
//        RecordDto result = recordService.editRecord(trainingId, input, principalDetails.getMember());
//        return ResponseEntity.ok(result);
//    }
//
//
//    @DeleteMapping("/training/{id}/delete")
//    public ResponseEntity<Void> deleteRecord(@PathVariable("id") Long trainingId,
//                                             @AuthenticationPrincipal PrincipalDetails principalDetails) {
//        recordService.deleteRecord(trainingId, principalDetails.getMember());
//        return ResponseEntity.ok().build();
//    }
//
//
//    @GetMapping("/all")
//    public ResponseEntity<List<RecordDto>> getAllRecords(@AuthenticationPrincipal PrincipalDetails principalDetails) {
//        List<RecordDto> records = recordService.getAllRecords(principalDetails.getMember());
//        return ResponseEntity.ok(records);
//    }
//}