package backend.goorm.record.dto;

import backend.goorm.record.entity.Memo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemoDto {
    private String content;

    public static MemoDto fromEntity(Memo memo) {
        return MemoDto.builder()
                .content(memo.getContent())
                .build();
    }
}
