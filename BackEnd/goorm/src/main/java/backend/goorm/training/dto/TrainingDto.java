package backend.goorm.training.dto;

import backend.goorm.training.model.entity.Training;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrainingDto {
    private Long id;
    private String name;
    private String categoryName;

    public static TrainingDto fromEntity(Training training) {
        TrainingDto dto = new TrainingDto();
        dto.setId(training.getTrainingId());
        dto.setName(training.getTrainingName());
        if (training.getCategory() != null) {
            dto.setCategoryName(training.getCategory().getCategoryName().name());
        } else {
            dto.setCategoryName("Unknown"); // 또는 기본 값을 설정
        }
        return dto;
    }
}


