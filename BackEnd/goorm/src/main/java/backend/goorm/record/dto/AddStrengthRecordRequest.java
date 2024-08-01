package backend.goorm.record.dto;

import backend.goorm.record.entity.Record;
import backend.goorm.training.model.entity.Training;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddStrengthRecordRequest {

    private Integer durationMinutes;
    private String intensity;
    private Integer sets;
    private Integer reps;
    private Integer weight;
    private String memo;
    private Integer satisfaction;
    private LocalDate exerciseDate;

    public static Record toEntity(AddStrengthRecordRequest request, Training training) {
        return Record.builder()
                .training(training)
                .caloriesBurned(0f)  // Set default value for caloriesBurned
                .durationMinutes(request.getDurationMinutes())
                .intensity(request.getIntensity())
                .sets(request.getSets())
                .reps(request.getReps())
                .weight(request.getWeight())
                .exerciseDate(request.getExerciseDate() != null ? request.getExerciseDate() : LocalDate.now())
                .recordDate(LocalDateTime.now())
                .memo(request.getMemo())
                .satisfaction(request.getSatisfaction())
                .build();
    }
}
