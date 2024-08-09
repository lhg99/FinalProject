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
    private Long memoId;
    private Long memberId; // Member 객체 대신 memberId만 포함
    private String content;
    private LocalDate date;
    private LocalDate createdAt;

    public static DietMemoDto fromEntity(DietMemo memo) {
        return DietMemoDto.builder()
                .memoId(memo.getMemoId())
                .memberId(memo.getMember().getMemberId()) // Member 객체 대신 memberId만 설정
                .content(memo.getContent())
                .date(memo.getDate())
                .createdAt(memo.getCreatedAt())
                .build();
    }
}
