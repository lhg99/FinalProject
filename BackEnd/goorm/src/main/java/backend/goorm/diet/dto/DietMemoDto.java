package backend.goorm.diet.dto;

import backend.goorm.diet.entity.DietMemo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DietMemoDto {
    private String content;
    private LocalDate date;

    public static DietMemo fromEntity(DietMemo memo) {
        return DietMemo.builder()
                .content(memo.getContent())
                .date(memo.getDate())
                .build();
    }
}
