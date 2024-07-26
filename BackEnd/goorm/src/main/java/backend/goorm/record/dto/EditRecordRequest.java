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

//    private LocalDateTime modifiedDate;
    private Float caloriesBurned;
    private Integer durationMinutes;
    private String intensity;
    private Integer sets;
    private Integer weight;
    private Integer reps;
    private Float distance;
    private String memo;
    private Integer satisfaction;


    public static Record updateStrengthRecord(Record record, EditRecordRequest edit, String imageUrl) {
        record.setCaloriesBurned(edit.getCaloriesBurned());
        record.setDurationMinutes(edit.getDurationMinutes());
        record.setIntensity(edit.getIntensity());
        record.setSets(edit.getSets());
        record.setWeight(edit.getWeight());
        record.setReps(edit.getReps());
        record.setMemo(edit.getMemo());
        record.setSatisfaction(edit.getSatisfaction());
        if (imageUrl != null) {
            record.setImageUrl(imageUrl);
        }
        return record;
    }

    public static Record updateCardioRecord(Record record, EditRecordRequest edit, String imageUrl) {
        record.setCaloriesBurned(edit.getCaloriesBurned());
        record.setDurationMinutes(edit.getDurationMinutes());
        record.setIntensity(edit.getIntensity());
        record.setDistance(edit.getDistance());
        record.setMemo(edit.getMemo());
        record.setSatisfaction(edit.getSatisfaction());
        if (imageUrl != null) {
            record.setImageUrl(imageUrl);
        }
        return record;
    }
}
