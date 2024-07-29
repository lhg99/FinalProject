package backend.goorm.diet.controller;

import backend.goorm.diet.dto.FoodResponseDto;
import backend.goorm.diet.dto.FoodUserDto;
import backend.goorm.diet.service.FoodService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collection;

@Slf4j
@RestController
@RequestMapping("api/food")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    @GetMapping
    @Operation(summary = "음식명을 통한 음식 검색", description = "음식 명으로 음식 상세 정보를 검색한다.(최대 20개)")
    public ResponseEntity<Collection<FoodResponseDto>> getFoodByName(
            @RequestParam(required = true) String name) {
        Collection<FoodResponseDto> response = foodService.getFoodByName(null, name);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/recent")
    @Operation(summary = "최근에 유저가 먹은 음식 리스트", description = "최근에 유저가 먹은 음식 중 상위 20개를 검색")
    public ResponseEntity<Collection<FoodResponseDto>> getRecentFood() {
        Collection<FoodResponseDto> response = foodService.getRecentFood(null);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping
    @Operation(summary = "유저 커스텀 음식 생성", description = "유저의 커스텀 음식을 생성한다")
    public ResponseEntity<FoodResponseDto> createFood(
            @ModelAttribute FoodUserDto dto
            ) {
        FoodResponseDto response = foodService.createFood(null, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("{food_id}")
    @Operation(summary = "유저 커스텀 음식 수정", description = "유저의 커스텀 음식을 수정한다")
    public ResponseEntity<FoodResponseDto> updateFood(
            @PathVariable Long food_id,
            @ModelAttribute FoodUserDto dto
            ) {
        FoodResponseDto response = foodService.updateFood(null, food_id, dto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("{food_id}")
    @Operation(summary = "유저 커스텀 음식 삭제", description = "요청을 보내는 유저의 커스텀 음식을 삭제한다")
    public ResponseEntity<Boolean> deleteFood(
            @PathVariable Long food_id) {
        boolean response = foodService.deleteFood(null, food_id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
