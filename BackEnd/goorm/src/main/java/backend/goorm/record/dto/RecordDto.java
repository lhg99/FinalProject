package backend.goorm.record.dto;
import backend.goorm.record.entity.Record;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecordDto {
    private Long recordId;
    private Float caloriesBurned;
    private Integer durationMinutes;
    private String intensity;
    private Integer sets;
    private Integer weight;
    private Float distance;
    private String memo;
    private Integer satisfaction;

    public static RecordDto fromEntity(Record record) {
        RecordDto dto = new RecordDto();
        dto.setRecordId(record.getRecordId());
        dto.setCaloriesBurned(record.getCaloriesBurned());
        dto.setDurationMinutes(record.getDurationMinutes());
        dto.setIntensity(record.getIntensity());
        dto.setSets(record.getSets());
        dto.setWeight(record.getWeight());
        dto.setDistance(record.getDistance());
        dto.setMemo(record.getMemo());
        dto.setSatisfaction(record.getSatisfaction());
        return dto;
    }
}