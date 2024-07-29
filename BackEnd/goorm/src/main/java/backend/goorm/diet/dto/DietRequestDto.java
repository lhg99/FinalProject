package backend.goorm.diet.dto;

import lombok.*;

@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class DietRequestDto {
    private Float quantity;
    private Long foodId;
}