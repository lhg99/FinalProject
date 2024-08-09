package backend.goorm.record.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SimplePageResponse<T> {
    private List<T> content;
    private int totalPages;
    private long totalElements;
}