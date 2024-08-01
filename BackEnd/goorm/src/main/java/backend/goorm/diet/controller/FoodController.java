package backend.goorm.diet.controller;

import backend.goorm.diet.api.FoodDataApiService;
import backend.goorm.diet.dto.FoodResponseDto;
import backend.goorm.diet.dto.FoodUpdateRequestDto;
import backend.goorm.diet.dto.FoodUserDto;
import backend.goorm.diet.service.FoodService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


import java.util.Collection;

@Slf4j
@RestController
@RequestMapping("api/food")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;
    private final FoodDataApiService foodDataApiService;

    @PostMapping("/SaveApiData")
    public ResponseEntity<String> initializeFoodData() {
        try {
            foodDataApiService.fetchAndSaveFoodData();
            return ResponseEntity.status(HttpStatus.OK).body("Food data initialized successfully");
        } catch (Exception e) {
            log.error("Error initializing food data", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to initialize food data");
        }
    }

    @GetMapping
    public ResponseEntity<Collection<FoodResponseDto>> getFoodByName(
            @RequestParam(required = true) String name) {
        Collection<FoodResponseDto> response = foodService.getFoodByName(null, name);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/all")
    public ResponseEntity<Collection<FoodResponseDto>> getAllFoods() {
        Collection<FoodResponseDto> response = foodService.getAllFoods();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/recent")
    public ResponseEntity<Collection<FoodResponseDto>> getRecentFood() {
        Collection<FoodResponseDto> response = foodService.getRecentFood(null);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping
    public ResponseEntity<FoodResponseDto> createFood(
            @ModelAttribute FoodUserDto dto
    ) {
        FoodResponseDto response = foodService.createFood(null, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("{food_id}")
    public ResponseEntity<FoodResponseDto> updateFood(
            @PathVariable("food_id") Long foodId,
            @ModelAttribute FoodUpdateRequestDto dto
    ) {
        FoodResponseDto response = foodService.updateFood(null, foodId, dto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("{food_id}")
    public ResponseEntity<Boolean> deleteFood(
            @PathVariable Long food_id) {
        boolean response = foodService.deleteFood(null, food_id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
