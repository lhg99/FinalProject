package backend.goorm.training.dto;

import backend.goorm.training.model.entity.Training;
import backend.goorm.training.model.entity.TrainingCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddTrainingInput {
    private String trainingName;
    private TrainingCategory category;

    public static Training toEntity(AddTrainingInput input) {
        Training training = new Training();
        training.setTrainingName(input.getTrainingName());
        training.setCategory(input.getCategory());
        training.setUserCustom(true);  // Ensure user_custom is set to true for custom training
        return training;
    }
}
