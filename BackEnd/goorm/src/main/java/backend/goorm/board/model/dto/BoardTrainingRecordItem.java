package backend.goorm.board.model.dto;

import backend.goorm.training.model.enums.TrainingCategoryType;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BoardTrainingRecordItem {

    private Long recordId;

    private String exerciseDate;

    private TrainingCategoryType categoryName;

    private String trainingName;

    private Integer durationMinutes;

    private Float caloriesBurned;

    private Integer sets;

    private Integer reps;

    private Integer weight;

    private Float distance;

    private Float incline;

}
