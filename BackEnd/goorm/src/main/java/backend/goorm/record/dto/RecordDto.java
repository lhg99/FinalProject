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
    private Float incline;
    private String memo;
    private Integer satisfaction;
    private String trainingName;
    private LocalDate exerciseDate;
    private String categoryName;
    private LocalDateTime modifiedDate;

    // fromEntity method to map Record entity and memo content to RecordDto
    public static RecordDto fromEntity(Record record, String memo) {
        RecordDto dto = new RecordDto();
        dto.setRecordId(record.getRecordId());
        dto.setCaloriesBurned(record.getCaloriesBurned());
        dto.setDurationMinutes(record.getDurationMinutes());
        dto.setIntensity(record.getIntensity());
        dto.setSets(record.getSets());
        dto.setReps(record.getReps());
        dto.setWeight(record.getWeight());
        dto.setDistance(record.getDistance());
        dto.setIncline(record.getIncline());
        dto.setMemo(memo); // Set memo content
        dto.setSatisfaction(record.getSatisfaction());
        dto.setTrainingName(record.getTraining().getTrainingName());
        dto.setExerciseDate(record.getExerciseDate());
        dto.setCategoryName(String.valueOf(record.getTraining().getCategory().getCategoryName())); // Correctly retrieve category name
        dto.setModifiedDate(record.getModifiedDate());
        return dto;
    }

    // Overloaded method if memo is not available
    public static RecordDto fromEntity(Record record) {
        return fromEntity(record, null); // Use null or default value if memo is not provided
    }
}
