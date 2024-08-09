package backend.goorm.diet.dto;

import backend.goorm.diet.entity.Food;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FoodUserDto {
    private String foodType;
    private String foodName;
    private Double amount; // NULL 값 허용하지 않음
    private Float calories;
    private Float carbohydrate;
    private Float protein;
    private Float fat;
    private Float sugar;
    private Float salt;
    private Float cholesterol;
    private Float saturatedFat;
    private Float transFat;
    private String imageUrl; // 이미지 URL 필드 추가
    private Integer useCount = 0; // 기본값 설정
    private Boolean userRegister = true;

    public Food toEntity() {
        if (this.amount == null) {
            throw new IllegalArgumentException("Amount cannot be null");
        }

        return Food.builder()
                .foodType(this.foodType)
                .foodName(this.foodName)
                .amount(this.amount)
                .calories(this.calories)
                .carbohydrate(this.carbohydrate)
                .protein(this.protein)
                .fat(this.fat)
                .sugar(this.sugar)
                .salt(this.salt)
                .cholesterol(this.cholesterol)
                .saturatedFat(this.saturatedFat)
                .transFat(this.transFat)
                .useCount(this.useCount) // 기본값 설정
                .userRegister(this.userRegister) // 유저가 등록한 음식인지 여부 설정
                .build();
    }

    public void updateEntity(Food food) {
        if (this.amount == null) {
            throw new IllegalArgumentException("Amount cannot be null");
        }

        food.setFoodType(this.foodType);
        food.setFoodName(this.foodName);
        food.setAmount(this.amount);
        food.setCalories(this.calories);
        food.setCarbohydrate(this.carbohydrate);
        food.setProtein(this.protein);
        food.setFat(this.fat);
        food.setSugar(this.sugar);
        food.setSalt(this.salt);
        food.setCholesterol(this.cholesterol);
        food.setSaturatedFat(this.saturatedFat);
        food.setTransFat(this.transFat);
        food.setUseCount(this.useCount); // 기본값 설정
        food.setUserRegister(this.userRegister);
    }
}
