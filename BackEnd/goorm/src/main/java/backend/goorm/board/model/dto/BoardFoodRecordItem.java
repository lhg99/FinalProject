package backend.goorm.board.model.dto;

import backend.goorm.diet.enums.MealTime;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BoardFoodRecordItem {

    private Long foodRecordId;

    private MealTime mealTime;

    private String foodName;

    private Float calories;

    private Float carbohydrates;

    private Float proteins;

    private Float fats;

    private String dietDate;

}
