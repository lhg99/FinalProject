package backend.goorm.diet.dto;

import backend.goorm.diet.entity.Diet;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class DietResponseDto {
    private Long dietId;
    private String mealTime;
    private LocalDate dietDate;
    private Float quantity;
    private Float gram;
    private FoodResponseDto foodRes;
    private Float totalCalories;
    private Float totalGram;
    private String memo;

    // 메모와 칼로리를 모두 포함한 변환
    public static DietResponseDto fromEntityWithMemo(Diet diet, String memoContent) {
        return DietResponseDto.builder()
                .dietId(diet.getDietId())
                .mealTime(diet.getMealTime().toString())
                .dietDate(diet.getDietDate())
                .quantity(diet.getQuantity())
                .gram(diet.getGram())
                .foodRes(FoodResponseDto.fromEntity(diet.getFood()))
                .totalCalories(diet.getTotalCalories())
                .totalGram(calculateTotalGram(diet))
                .memo(memoContent)
                .build();
    }

    public static DietResponseDto fromEntity(Diet diet) {
        return fromEntity(diet, null);
    }

    public static DietResponseDto fromEntity(Diet diet, String memoContent) {
        return DietResponseDto.builder()
                .dietId(diet.getDietId())
                .mealTime(diet.getMealTime().toString())
                .dietDate(diet.getDietDate())
                .quantity(diet.getQuantity())
                .gram(diet.getGram())
                .foodRes(FoodResponseDto.fromEntity(diet.getFood()))
                .totalCalories(diet.getTotalCalories())
                .totalGram(calculateTotalGram(diet))
                .memo(memoContent != null ? memoContent : (diet.getDietMemo() != null ? diet.getDietMemo().getContent() : null))
                .build();
    }

    private static Float calculateTotalGram(Diet diet) {
        if (diet.getGram() != null) {
            return diet.getGram();  // 사용자가 gram을 입력한 경우
        } else if (diet.getQuantity() != null && diet.getFood() != null) {
            return diet.getQuantity() * diet.getFood().getGram();  // 사용자가 quantity를 입력한 경우
        } else {
            return 0f;  // default
        }
    }


    // 메모가 없는 경우의 리스트 변환 메서드
    public static List<DietResponseDto> fromEntityList(List<Diet> diets) {
        return diets.stream()
                .map(DietResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 메모가 있는 경우의 리스트 변환 메서드
    public static List<DietResponseDto> fromEntityListWithMemo(List<Diet> diets, String memoContent) {
        return diets.stream()
                .map(diet -> fromEntityWithMemo(diet, memoContent))
                .collect(Collectors.toList());
    }
}
