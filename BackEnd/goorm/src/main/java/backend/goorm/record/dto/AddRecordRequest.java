package backend.goorm.record.dto;

import backend.goorm.record.entity.Record;
import backend.goorm.training.model.entity.Training;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddRecordRequest {

    private Long trainingId;
    private LocalDateTime recordDate;
    private LocalDateTime modifiedDate;
    private Float caloriesBurned;
    private Integer durationMinutes;
    private String intensity;
    private Integer sets;
    private Integer weight;
    private Float distance;
    private Boolean userRegister;
    private String memo;
    private Integer satisfaction;

    public static Record toEntity(AddRecordRequest input, Training training) {
        return Record.builder()
                .training(training)
                .recordDate(input.getRecordDate())
                .modifiedDate(input.getModifiedDate())
                .caloriesBurned(input.getCaloriesBurned())
                .durationMinutes(input.getDurationMinutes())
                .intensity(input.getIntensity())
                .sets(input.getSets())
                .weight(input.getWeight())
                .distance(input.getDistance())
                .userRegister(input.getUserRegister())
                .memo(input.getMemo())
                .satisfaction(input.getSatisfaction())
                .build();
    }


}
