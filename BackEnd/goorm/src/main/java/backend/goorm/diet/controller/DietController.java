package backend.goorm.diet.controller;

import backend.goorm.diet.dto.*;
import backend.goorm.diet.entity.DietMemo;
import backend.goorm.diet.service.DietService;
import backend.goorm.member.oauth.PrincipalDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("api/diet")
@RequiredArgsConstructor
public class DietController {

    private final DietService dietService;
    private final ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<DietResponseDto>> getDietByDate(@RequestParam("date") LocalDate date,
                                                               @AuthenticationPrincipal PrincipalDetails principalDetails) {
        List<DietResponseDto> response = dietService.getDietByDate(date, principalDetails.member());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<DietResponseDto>> getAllDiets(@AuthenticationPrincipal PrincipalDetails principalDetails) {
        List<DietResponseDto> response = dietService.getAllDiets(principalDetails.member());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping
    public ResponseEntity<List<DietResponseDto>> createDiet(
            @RequestPart("diet") String dietJson,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {
        try {
            DietCreateRequestDto dto = objectMapper.readValue(dietJson, DietCreateRequestDto.class);
            List<DietResponseDto> response = dietService.createDiet(dto, principalDetails.member());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error parsing diet JSON", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }


    @DeleteMapping("{dietId}")
    public ResponseEntity<Boolean> deleteDiet(@PathVariable("dietId") Long dietId,
                                              @AuthenticationPrincipal PrincipalDetails principalDetails) {
        boolean response = dietService.deleteDiet(dietId, principalDetails.member());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // 새로운 메모 추가
    @PostMapping("/dietMemo")
    public ResponseEntity<DietMemoDto> addOrUpdateMemo(@RequestBody DietMemoDto memoDto,
                                                    @AuthenticationPrincipal PrincipalDetails principalDetails) {
        DietMemoDto response = dietService.addOrUpdateDietMemo(memoDto, principalDetails.member());
        return ResponseEntity.ok(response);
    }

    // 메모 조회
    @GetMapping("/dietMemo")
    public ResponseEntity<String> getMemoByDate(@RequestParam("date") LocalDate date,
                                                @AuthenticationPrincipal PrincipalDetails principalDetails) {
        String memoContent = dietService.getDietMemo(principalDetails.member(), date);
        if (memoContent != null) {
            return ResponseEntity.ok(memoContent);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Memo not found for the specified date");
        }
    }

    @PutMapping("/edit-multiple")
    public ResponseEntity<List<DietResponseDto>> editDietsAndMemo(
            @RequestBody List<DietUpdateRequestDto> requests,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {

        List<DietResponseDto> response = dietService.editDietsAndMemos(requests, principalDetails.member());
        return ResponseEntity.ok(response);
    }

    // Controller Method
    @GetMapping("/nutrient")
    public ResponseEntity<Map<String, NutrientPercentage>> getNutrientPercentageForDate(
            @AuthenticationPrincipal PrincipalDetails principalDetails,
            @RequestParam("date") LocalDate date) {
        Map<String, NutrientPercentage> macroPercentages = dietService.getNutrientPercentageForDate(principalDetails.member(),date);
        return ResponseEntity.ok(macroPercentages);
    }
}
