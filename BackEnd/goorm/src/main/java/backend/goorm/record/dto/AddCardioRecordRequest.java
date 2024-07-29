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
public class AddCardioRecordRequest {

    private Float caloriesBurned;
    private Integer durationMinutes;
    private String intensity;
    private Float distance;
    private Float incline;
    private String memo;
    private Integer satisfaction;
    private LocalDate exerciseDate;


    public static Record toEntity(AddCardioRecordRequest request, Training training) {
        return Record.builder()
                .training(training)
                .caloriesBurned(request.getCaloriesBurned())
                .durationMinutes(request.getDurationMinutes())
                .intensity(request.getIntensity())
                .distance(request.getDistance())
                .incline(request.getIncline())
                .exerciseDate(request.getExerciseDate() != null ? request.getExerciseDate() : LocalDate.now())
                .recordDate(LocalDateTime.now())
                .memo(request.getMemo())
                .satisfaction(request.getSatisfaction())
                .build();
    }
}
