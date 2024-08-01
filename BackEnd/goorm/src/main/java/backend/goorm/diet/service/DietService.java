package backend.goorm.diet.service;

import backend.goorm.diet.dto.DietCreateRequestDto;
import backend.goorm.diet.dto.DietResponseDto;
import backend.goorm.diet.dto.DietUpdateRequestDto;
import backend.goorm.diet.entity.Diet;
import backend.goorm.diet.entity.DietImages;
import backend.goorm.diet.entity.Food;
import backend.goorm.diet.enums.MealTime;
import backend.goorm.diet.repository.DietRepository;
import backend.goorm.diet.repository.FoodRepository;
import backend.goorm.s3.service.S3ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class DietService {

    private final DietRepository dietRepository;
    private final FoodRepository foodRepository;
    private final S3ImageService s3ImageService;

    public List<DietResponseDto> getDietByDate(LocalDate date) {
        List<Diet> diets = dietRepository.findByDietDate(date);
        return DietResponseDto.fromEntityList(diets);
    }

    public List<DietResponseDto> getAllDiets() {
        List<Diet> diets = dietRepository.findAll();
        return DietResponseDto.fromEntityList(diets);
    }

    public List<DietResponseDto> createDiet(DietCreateRequestDto dto, MultipartFile[] images) {
        List<DietResponseDto> responses = dto.getFoodQuantities().stream().map(foodQuantity -> {
            Food food = foodRepository.findById(foodQuantity.getFoodId())
                    .orElseThrow(() -> new IllegalArgumentException("Food not found with id: " + foodQuantity.getFoodId()));

            Diet diet = Diet.builder()
                    .food(food)
                    .quantity(foodQuantity.getQuantity())
                    .mealTime(MealTime.valueOf(dto.getMealTime().toUpperCase()))
                    .dietDate(dto.getDietDate())
                    .member(null) // 멤버를 null로 설정
                    .build();

            if (images != null && images.length > 0) {
                List<String> imageUrls = s3ImageService.uploadMulti(images);
                List<DietImages> dietImages = imageUrls.stream()
                        .map(url -> new DietImages(diet, url))
                        .collect(Collectors.toList());
                diet.setDietImages(dietImages);
            }

            Diet savedDiet = dietRepository.save(diet);
            return DietResponseDto.fromEntity(savedDiet);
        }).collect(Collectors.toList());

        return responses;
    }

    public DietResponseDto updateDiet(Long dietId, DietUpdateRequestDto dto, MultipartFile[] images) {
        Diet diet = dietRepository.findById(dietId)
                .orElseThrow(() -> new IllegalArgumentException("Diet not found with id: " + dietId));

        dto.updateEntity(diet);

        if (images != null && images.length > 0) {
            diet.getDietImages().forEach(image -> s3ImageService.deleteImageFromS3(image.getImageUrl()));
            List<String> imageUrls = s3ImageService.uploadMulti(images);
            List<DietImages> dietImages = imageUrls.stream()
                    .map(url -> new DietImages(diet, url))
                    .collect(Collectors.toList());
            diet.setDietImages(dietImages);
        }

        dietRepository.save(diet);
        return DietResponseDto.fromEntity(diet);
    }

    public boolean deleteDiet(Long dietId) {
        Diet diet = dietRepository.findById(dietId)
                .orElseThrow(() -> new IllegalArgumentException("Diet not found with id: " + dietId));

        dietRepository.delete(diet);
        return true;
    }
}
