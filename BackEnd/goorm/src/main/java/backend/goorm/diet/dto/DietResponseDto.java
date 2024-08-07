package backend.goorm.diet.dto;

import backend.goorm.diet.entity.Diet;
import backend.goorm.diet.entity.DietImages;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class DietResponseDto {
    private Long dietId;
    private String mealType;
    private LocalDate dietDate;
    private Float quantity;
    private FoodResponseDto foodRes;
    private List<String> imageUrls;

    public static DietResponseDto fromEntity(Diet diet) {
        return DietResponseDto.builder()
                .dietId(diet.getDietId())
                .mealType(diet.getMealTime().toString())
                .dietDate(diet.getDietDate())
                .quantity(diet.getQuantity())
                .foodRes(FoodResponseDto.fromEntity(diet.getFood()))  // Add this line to include FoodResponseDto
                .imageUrls(diet.getDietImages().stream()
                        .map(DietImages::getImageUrl)
                        .collect(Collectors.toList()))
                .build();
    }

    public static List<DietResponseDto> fromEntityList(List<Diet> diets) {
        return diets.stream()
                .map(DietResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
