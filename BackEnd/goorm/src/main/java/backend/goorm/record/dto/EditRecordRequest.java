package backend.goorm.record.dto;

import backend.goorm.record.entity.Record;
import backend.goorm.record.enums.Intensity;
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
public class EditRecordRequest {

    private Long recordId;  // Record ID를 요청에서 받도록 추가
    private Integer durationMinutes;
    private Intensity intensity;
    private Integer sets;
    private Integer weight;
    private Integer reps;
    private Float distance;
    private String memo;
    private Integer satisfaction;

    public static Record updateRecord(Record record, EditRecordRequest edit, boolean isCardio, Float calculatedCalories) {
        // 공통된 필드 업데이트
        record.setDurationMinutes(edit.getDurationMinutes());
        record.setSatisfaction(edit.getSatisfaction());
        record.setIntensity(edit.getIntensity().name());

        if (isCardio) {
            // 유산소 운동 필드 업데이트
            record.setDistance(edit.getDistance());
            record.setCaloriesBurned(calculatedCalories); // 칼로리 재계산
        } else {
            // 근력 운동 필드 업데이트
            record.setSets(edit.getSets());
            record.setWeight(edit.getWeight());
            record.setReps(edit.getReps());
        }

        return record;
    }
}
