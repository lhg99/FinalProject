package backend.goorm.record.dto;

import backend.goorm.record.entity.Record;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class RecordDto {
    private Long recordId;
    private Float caloriesBurned;
    private Integer durationMinutes;
    private String intensity;
    private Integer sets;
    private Integer reps;
    private Integer weight;
    private Float distance;
    private String memo;
    private Integer satisfaction;
    private String trainingName;
    private LocalDate exerciseDate;
    private String categoryName;
    private LocalDateTime modifiedDate;
    private Float totalCaloriesBurned;

    public static RecordDto fromEntity(Record record, String memo, Float totalCaloriesBurned) {
        RecordDto dto = new RecordDto();
        dto.setRecordId(record.getRecordId());
        dto.setCaloriesBurned(record.getCaloriesBurned());
        dto.setDurationMinutes(record.getDurationMinutes());
        dto.setIntensity(record.getIntensity());
        dto.setSets(record.getSets());
        dto.setReps(record.getReps());
        dto.setWeight(record.getWeight());
        dto.setDistance(record.getDistance());
        dto.setMemo(memo); // Set memo content
        dto.setSatisfaction(record.getSatisfaction());
        dto.setTrainingName(record.getTraining().getTrainingName());
        dto.setExerciseDate(record.getExerciseDate());
        dto.setCategoryName(String.valueOf(record.getTraining().getCategory().getCategoryName())); // Correctly retrieve category name
        dto.setModifiedDate(record.getModifiedDate());
        dto.setTotalCaloriesBurned(totalCaloriesBurned);
        return dto;
    }

    public static RecordDto fromEntity(Record record, String memo) {
        return fromEntity(record, memo, null);
    }

    public static RecordDto fromEntity(Record record) {
        return fromEntity(record, null, null);
    }
}
