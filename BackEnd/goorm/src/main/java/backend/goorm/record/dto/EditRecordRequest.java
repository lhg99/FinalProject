package backend.goorm.record.dto;

import backend.goorm.record.entity.Record;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EditRecordRequest {

    private Float caloriesBurned;
    private Integer durationMinutes;
    private String intensity;
    private Integer sets;
    private Integer weight;
    private Integer reps;
    private Float distance;
    private String memo;
    private Integer satisfaction;
    private List<String> imageUrls;

    public static Record updateStrengthRecord(Record record, EditRecordRequest edit) {
        record.setDurationMinutes(edit.getDurationMinutes());
        record.setIntensity(edit.getIntensity());
        record.setSets(edit.getSets());
        record.setWeight(edit.getWeight());
        record.setReps(edit.getReps());
        record.setMemo(edit.getMemo());
        record.setSatisfaction(edit.getSatisfaction());
        return record;
    }

    public static Record updateCardioRecord(Record record, EditRecordRequest edit) {
        record.setCaloriesBurned(edit.getCaloriesBurned());
        record.setDurationMinutes(edit.getDurationMinutes());
        record.setIntensity(edit.getIntensity());
        record.setDistance(edit.getDistance());
        record.setMemo(edit.getMemo());
        record.setSatisfaction(edit.getSatisfaction());
        return record;
    }
}
