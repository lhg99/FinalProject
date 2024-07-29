package backend.goorm.record.dto;

import backend.goorm.record.entity.Record;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class RecordDto {
    private Long recordId;
    private Float caloriesBurned;
    private Integer durationMinutes;
    private String intensity;
    private Integer sets;
    private Integer reps; // 횟수 필드 추가
    private Integer weight;
    private Float distance;
    private Float incline; // 경사 필드 추가
    private String memo;
    private Integer satisfaction;
    private String trainingName; // 운동 이름 필드 추가
    private LocalDate exerciseDate; // 운동 날짜 필드 추가
    private String imageUrl;
    private String categoryName; // 운동 카테고리 이름 필드 추가

    public static RecordDto fromEntity(Record record) {
        RecordDto dto = new RecordDto();
        dto.setRecordId(record.getRecordId());
        dto.setCaloriesBurned(record.getCaloriesBurned());
        dto.setDurationMinutes(record.getDurationMinutes());
        dto.setIntensity(record.getIntensity());
        dto.setSets(record.getSets());
        dto.setReps(record.getReps()); // 횟수 필드 설정
        dto.setWeight(record.getWeight());
        dto.setDistance(record.getDistance());
        dto.setIncline(record.getIncline()); // 경사 필드 설정
        dto.setMemo(record.getMemo());
        dto.setSatisfaction(record.getSatisfaction());
        dto.setTrainingName(record.getTraining().getTrainingName()); // 운동 이름 필드 설정
        dto.setExerciseDate(record.getExerciseDate()); // 운동 날짜 필드 설정
        dto.setImageUrl(record.getImageUrl());
        dto.setCategoryName(String.valueOf(record.getTraining().getCategory().getCategoryName())); // 운동 카테고리 이름 설정
        return dto;
    }
}
