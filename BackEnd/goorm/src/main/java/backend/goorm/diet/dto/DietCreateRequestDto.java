package backend.goorm.diet.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class DietCreateRequestDto {
    private LocalDate dietDate;
    private String mealTime;
    private List<FoodQuantity> foodQuantities;

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Getter
    @Setter
    @ToString
    public static class FoodQuantity {
        private Long foodId;
        private Float quantity;
    }
}
