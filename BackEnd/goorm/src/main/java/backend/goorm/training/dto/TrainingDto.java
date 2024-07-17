package backend.goorm.training.dto;

import backend.goorm.training.model.entity.Training;
import backend.goorm.training.model.enums.TrainingCategoryType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrainingDto {
    private Long trainingId;
    private String trainingName;
    private TrainingCategoryType category;
    private Boolean userCustom;

    public static TrainingDto fromEntity(Training training) {
        TrainingDto dto = new TrainingDto();
        dto.setTrainingId(training.getTrainingId());
        dto.setTrainingName(training.getTrainingName());
        dto.setCategory(training.getCategory().getCategoryName());
        dto.setUserCustom(training.getUserCustom());
        return dto;
    }
}