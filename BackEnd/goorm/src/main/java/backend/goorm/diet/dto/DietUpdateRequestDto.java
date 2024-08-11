package backend.goorm.diet.dto;

import backend.goorm.diet.entity.Diet;
import backend.goorm.diet.entity.Food;
import backend.goorm.diet.enums.MealTime;
import backend.goorm.diet.repository.FoodRepository;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class DietUpdateRequestDto {
    private Long dietId;
    private LocalDate dietDate;
    private String mealTime;
    private List<FoodQuantity> foodQuantities;
    private String memo;

    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Getter
    @Setter
    @ToString
    public static class FoodQuantity {
        private Long foodId;
        private Float quantity;
        private Float gram;
    }

    public void updateEntity(Diet diet, FoodRepository foodRepository) {
        diet.setDietDate(this.dietDate);
        diet.setMealTime(MealTime.valueOf(this.mealTime.toUpperCase()));

        if (this.foodQuantities != null && !this.foodQuantities.isEmpty()) {
            // Food ID로 Food 객체를 데이터베이스에서 조회
            Food food = foodRepository.findById(this.foodQuantities.get(0).getFoodId())
                    .orElseThrow(() -> new IllegalArgumentException("Food not found with id: " + this.foodQuantities.get(0).getFoodId()));
            diet.setFood(food);
            diet.setQuantity(this.foodQuantities.get(0).getQuantity());
        }
    }

}
