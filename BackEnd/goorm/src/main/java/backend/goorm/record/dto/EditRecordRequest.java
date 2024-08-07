package backend.goorm.record.dto;

import backend.goorm.record.entity.Record;
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
    private Float caloriesBurned;
    private Integer durationMinutes;
    private String intensity;
    private Integer sets;
    private Integer weight;
    private Integer reps;
    private Float distance;
    private Float incline;
    private String memo;
    private Integer satisfaction;

    public static Record updateRecord(Record record, EditRecordRequest edit, boolean isCardio) {
        // 공통된 필드 업데이트
        record.setDurationMinutes(edit.getDurationMinutes());
        record.setCaloriesBurned(edit.getCaloriesBurned());
        record.setMemo(edit.getMemo());
        record.setSatisfaction(edit.getSatisfaction());
        record.setIntensity(edit.getIntensity());



        // 유산소 운동 필드 업데이트
        if (isCardio) {
            record.setIncline(edit.getIncline());
            record.setDistance(edit.getDistance());
        }
        // 근력 운동 필드 업데이트
        else {
            record.setSets(edit.getSets());
            record.setWeight(edit.getWeight());
            record.setReps(edit.getReps());
        }

        return record;
    }
}
