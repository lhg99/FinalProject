package backend.goorm.training.dto;

import backend.goorm.training.model.entity.Training;
import backend.goorm.training.model.entity.TrainingCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddTrainingRequest {
    private String trainingName;
    private TrainingCategory category; // 여기에서 TrainingCategory 전체를 받도록 수정

    public static Training toEntity(AddTrainingRequest request, TrainingCategory category) {
        Training training = new Training();
        training.setTrainingName(request.getTrainingName());
        training.setCategory(category);
        training.setUserCustom(true);  // Ensure user_custom is set to true for custom training
        return training;
    }
}
