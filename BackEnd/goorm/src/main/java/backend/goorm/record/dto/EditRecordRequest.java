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
    private Float distance;
    private String memo;
    private Integer satisfaction;

    public static Record updateRecord(Record record, EditRecordRequest edit) {
//        record.setModifiedDate(edit.getModifiedDate());
        record.setCaloriesBurned(edit.getCaloriesBurned());
        record.setDurationMinutes(edit.getDurationMinutes());
        record.setIntensity(edit.getIntensity());
        record.setSets(edit.getSets());
        record.setWeight(edit.getWeight());
        record.setDistance(edit.getDistance());
        record.setMemo(edit.getMemo());
        record.setSatisfaction(edit.getSatisfaction());
        return record;
    }
}
