package backend.goorm.diet.service;

import backend.goorm.diet.dto.FoodResponseDto;
import backend.goorm.diet.dto.FoodUpdateRequestDto;
import backend.goorm.diet.dto.FoodUserDto;
import backend.goorm.diet.entity.Food;
import backend.goorm.diet.repository.DietRepository;
import backend.goorm.diet.repository.FoodRepository;
import backend.goorm.member.model.entity.Member;
import backend.goorm.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class FoodService {

    private final FoodRepository foodRepository;
    private final MemberRepository memberRepository;
    private final DietRepository dietRepository;

    public List<FoodResponseDto> getFoodByName(Long id, String name) {
        if (name == null) {
            return null;
        }

        Pageable limit = PageRequest.of(0, 20);
        List<Food> foods = foodRepository.findDistinctFoodNameByMember(name, null, limit);
        return FoodResponseDto.fromEntityList(foods);
    }

    public List<FoodResponseDto> getAllFoods() {
        List<Food> foods = foodRepository.findAll();
        return FoodResponseDto.fromEntityList(foods);
    }

    public List<FoodResponseDto> getRecentFood(Long id) {
        Pageable pageRequest = PageRequest.of(0, 20, Sort.Direction.DESC, "createdAt");
        List<Food> foods = dietRepository.findDistinctFoodByMember(null, pageRequest);
        return FoodResponseDto.fromEntityList(foods);
    }

    public FoodResponseDto createFood(Long id, FoodUserDto dto) {
        if (dto.getAmount() == null) {
            throw new IllegalArgumentException("Amount cannot be null");
        }

        Food food = dto.toEntity();
        foodRepository.save(food);
        return FoodResponseDto.fromEntity(food);
    }

    public FoodResponseDto updateFood(Long id, Long foodId, FoodUpdateRequestDto dto) {
        if (dto.getAmount() == null) {
            throw new IllegalArgumentException("Amount cannot be null");
        }

        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new IllegalArgumentException("Food not found with id: " + foodId));

        dto.updateEntity(food);
        foodRepository.save(food);
        return FoodResponseDto.fromEntity(food);
    }

    public boolean deleteFood(Long id, Long foodId) {
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new IllegalArgumentException("Food not found with id: " + foodId));

        foodRepository.delete(food);
        return true;
    }
}
