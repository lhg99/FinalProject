package backend.goorm.diet.dto;

import backend.goorm.diet.entity.Diet;
import backend.goorm.diet.entity.Food;
import backend.goorm.diet.enums.MealTime;
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
    private LocalDate dietDate;
    private String mealTime;
    private List<FoodQuantity> foodQuantities;

    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Getter
    @Setter
    @ToString
    public static class FoodQuantity {
        private Long foodId;
        private Float quantity;
    }

    public void updateEntity(Diet diet) {
        diet.setDietDate(this.dietDate);
        diet.setMealTime(MealTime.valueOf(this.mealTime.toUpperCase()));
        if (this.foodQuantities != null && !this.foodQuantities.isEmpty()) {
            diet.setFood(Food.builder().foodId(this.foodQuantities.get(0).getFoodId()).build());
            diet.setQuantity(this.foodQuantities.get(0).getQuantity());
        }
    }
}
