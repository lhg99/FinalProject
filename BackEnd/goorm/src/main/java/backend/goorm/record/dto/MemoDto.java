package backend.goorm.record.dto;

import backend.goorm.record.entity.Memo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemoDto {
    private String content;
    private LocalDate date;

    public static MemoDto fromEntity(Memo memo) {
        return MemoDto.builder()
                .content(memo.getContent())
                .date(memo.getDate())
                .build();
    }
}
