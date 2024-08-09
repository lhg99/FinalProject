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
    private String mealType;
    private LocalDate dietDate;
    private Float quantity;
    private Float gram;
    private FoodResponseDto foodRes;
    private Float totalCalories;  // 추가된 필드
    private String memo;

    // 메모와 칼로리를 모두 포함한 변환
    public static DietResponseDto fromEntityWithMemo(Diet diet, String memoContent) {
        return DietResponseDto.builder()
                .dietId(diet.getDietId())
                .mealType(diet.getMealTime().toString())
                .dietDate(diet.getDietDate())
                .quantity(diet.getQuantity())
                .gram(diet.getGram())
                .foodRes(FoodResponseDto.fromEntity(diet.getFood()))
                .totalCalories(diet.getTotalCalories())  // 저장된 칼로리 사용
                .memo(memoContent)  // 전달된 메모 사용
                .build();
    }

    public static DietResponseDto fromEntity(Diet diet) {
        return fromEntity(diet, null); // 메모가 없을 때 사용
    }

    public static DietResponseDto fromEntity(Diet diet, String memoContent) {
        return DietResponseDto.builder()
                .dietId(diet.getDietId())
                .mealType(diet.getMealTime().toString())
                .dietDate(diet.getDietDate())
                .quantity(diet.getQuantity())
                .gram(diet.getGram())
                .foodRes(FoodResponseDto.fromEntity(diet.getFood()))  // 음식 정보 추가
                .totalCalories(diet.getTotalCalories())  // 저장된 총 칼로리 정보 추가
                .memo(memoContent != null ? memoContent : (diet.getDietMemo() != null ? diet.getDietMemo().getContent() : null))
                .build();
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
