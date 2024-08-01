package backend.goorm.diet.controller;

import backend.goorm.diet.dto.DietCreateRequestDto;
import backend.goorm.diet.dto.DietResponseDto;
import backend.goorm.diet.dto.DietUpdateRequestDto;
import backend.goorm.diet.service.DietService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("api/diet")
@RequiredArgsConstructor
public class DietController {

    private final DietService dietService;
    private final ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<DietResponseDto>> getDietByDate(@RequestParam("date") LocalDate date) {
        List<DietResponseDto> response = dietService.getDietByDate(date);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<DietResponseDto>> getAllDiets() {
        List<DietResponseDto> response = dietService.getAllDiets();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping
    public ResponseEntity<List<DietResponseDto>> createDiet(
            @RequestPart("diet") String dietJson,
            @RequestPart(value = "images", required = false) MultipartFile[] images) {
        try {
            DietCreateRequestDto dto = objectMapper.readValue(dietJson, DietCreateRequestDto.class);
            List<DietResponseDto> response = dietService.createDiet(dto, images);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error parsing diet JSON", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("{dietId}")
    public ResponseEntity<DietResponseDto> updateDiet(
            @PathVariable("dietId") Long dietId,
            @RequestPart("diet") String dietJson,
            @RequestPart(value = "images", required = false) MultipartFile[] images) {
        try {
            DietUpdateRequestDto dto = objectMapper.readValue(dietJson, DietUpdateRequestDto.class);
            DietResponseDto response = dietService.updateDiet(dietId, dto, images);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            log.error("Error parsing diet JSON", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("{dietId}")
    public ResponseEntity<Boolean> deleteDiet(@PathVariable("dietId") Long dietId) {
        boolean response = dietService.deleteDiet(dietId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
