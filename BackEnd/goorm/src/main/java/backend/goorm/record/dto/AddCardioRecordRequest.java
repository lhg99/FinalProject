package backend.goorm.record.dto;

import backend.goorm.record.entity.Record;
import backend.goorm.record.enums.Intensity;
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

    private Integer durationMinutes;
    private Intensity intensity; // 변경된 부분
    private Float distance;
    private Float incline;
    private Integer satisfaction;
    private LocalDate exerciseDate;

    public static Record toEntity(AddCardioRecordRequest request, Training training, Float calculatedCalories) {
        return Record.builder()
                .training(training)
                .caloriesBurned(calculatedCalories) // 계산된 칼로리만 사용
                .durationMinutes(request.getDurationMinutes())
                .intensity(request.getIntensity().name()) // 변경된 부분
                .distance(request.getDistance())
                .incline(request.getIncline())
                .exerciseDate(request.getExerciseDate() != null ? request.getExerciseDate() : LocalDate.now())
                .recordDate(LocalDateTime.now())
                .satisfaction(request.getSatisfaction())
                .build();
    }
}
