package backend.goorm.diet.service;

import backend.goorm.diet.dto.FoodResponseDto;
import backend.goorm.diet.dto.FoodUserDto;
import backend.goorm.diet.entity.Food;
import backend.goorm.diet.repository.DietRepository;
import backend.goorm.diet.repository.FoodRepository;
import backend.goorm.member.model.entity.Member;
import backend.goorm.member.repository.MemberRepository;
import backend.goorm.s3.service.S3ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class FoodService {

    private final FoodRepository foodRepository;
    private final MemberRepository memberRepository;
    private final DietRepository dietRepository;
    private final S3ImageService s3ImageService;

    public List<FoodResponseDto> getFoodByName(Long id, String name) {
        if (name == null) {
            return null;
        }

        Pageable limit = PageRequest.of(0, 20);
        List<Food> foods = foodRepository.findDistinctFoodNameByMember(name, null, limit);
        return FoodResponseDto.fromEntityList(foods);
    }

    public List<FoodResponseDto> getRecentFood(Long id) {
        Pageable pageRequest = PageRequest.of(0, 20, Sort.Direction.DESC, "createdAt");
        List<Food> foods = dietRepository.findDistinctFoodByMember(null, pageRequest);
        return FoodResponseDto.fromEntityList(foods);
    }

    public FoodResponseDto createFood(Long id, FoodUserDto dto ) {
        Food food = dto.toEntity();

//        if (image != null && !image.isEmpty()) {
//            String imageUrl = s3ImageService.upload(image);
//            food.setImageUrl(imageUrl);
//        }

        foodRepository.save(food);
        return FoodResponseDto.fromEntity(food);
    }

    public FoodResponseDto updateFood(Long id, Long foodId, FoodUserDto dto) {
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new IllegalArgumentException("Food not found with id: " + foodId));

        dto.updateEntity(food);

//        if (image != null && !image.isEmpty()) {
//            String imageUrl = s3ImageService.upload(image);
//            food.setImageUrl(imageUrl);
//        }

        foodRepository.save(food);
        return FoodResponseDto.fromEntity(food);
    }

    public boolean deleteFood(Long id, Long foodId) {
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new IllegalArgumentException("Food not found with id: " + foodId));

        String imageUrl = food.getImageUrl();
        if (imageUrl != null && !imageUrl.isEmpty()) {
            s3ImageService.deleteImageFromS3(imageUrl);
        }

        foodRepository.delete(food);
        return true;
    }
}
