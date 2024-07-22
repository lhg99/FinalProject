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

    public static Record updateRecord(Record record, EditRecordRequest input) {
        record.setModifiedDate(input.getModifiedDate());
        record.setCaloriesBurned(input.getCaloriesBurned());
        record.setDurationMinutes(input.getDurationMinutes());
        record.setIntensity(input.getIntensity());
        record.setSets(input.getSets());
        record.setWeight(input.getWeight());
        record.setDistance(input.getDistance());
        record.setUserRegister(input.getUserRegister());
        record.setMemo(input.getMemo());
        record.setSatisfaction(input.getSatisfaction());
        return record;
    }
}
