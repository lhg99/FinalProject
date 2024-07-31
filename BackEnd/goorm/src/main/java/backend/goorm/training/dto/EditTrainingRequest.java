package backend.goorm.training.dto;

import backend.goorm.training.model.entity.TrainingCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EditTrainingRequest {
    private Long id;
    private String trainingName;
    private TrainingCategory category;
}
