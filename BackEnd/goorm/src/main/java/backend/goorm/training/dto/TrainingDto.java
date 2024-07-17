package backend.goorm.training.dto;

import backend.goorm.training.model.entity.Training;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrainingDto {
    private Long id;
    private String trainingName;
    private String category;
    private Boolean userCustom;

    public static TrainingDto fromEntity(Training training) {
        TrainingDto dto = new TrainingDto();
        dto.setId(training.getTrainingId());
        dto.setTrainingName(training.getTrainingName());
        dto.setCategory(training.getCategory().getCategoryName().name());
        dto.setUserCustom(training.getUserCustom());
        return dto;
    }
}
