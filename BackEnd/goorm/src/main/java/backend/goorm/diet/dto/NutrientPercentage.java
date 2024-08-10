package backend.goorm.diet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NutrientPercentage {
    private double carbsPercentage;
    private double proteinPercentage;
    private double fatPercentage;
    private double totalCalories;   // 추가
}

