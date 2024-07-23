package backend.goorm.record.dto;

import backend.goorm.record.entity.Record;
import backend.goorm.training.model.entity.Training;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddStrengthRecordRequest {

    private Float caloriesBurned;
    private Integer durationMinutes;
    private String intensity;
    private Integer sets;
    private Integer reps; // 횟수 추가
    private Integer weight;
    private String memo;
    private Integer satisfaction;
    private LocalDate exerciseDate; // 운동 날짜 추가

    public static Record toEntity(AddStrengthRecordRequest request, Training training) {
        return Record.builder()
                .training(training)
                .caloriesBurned(request.getCaloriesBurned())
                .durationMinutes(request.getDurationMinutes())
                .intensity(request.getIntensity())
                .sets(request.getSets())
                .reps(request.getReps()) // 횟수 설정
                .weight(request.getWeight())
                .exerciseDate(request.getExerciseDate()) // 운동 날짜 설정
                .recordDate(LocalDateTime.now()) // 기록 날짜를 현재 시간으로 설정
                .memo(request.getMemo())
                .satisfaction(request.getSatisfaction())
                .build();
    }

//    public static Record updateRecord(Record record, AddStrengthRecordRequest input) {
//        record.setCaloriesBurned(input.getCaloriesBurned());
//        record.setDurationMinutes(input.getDurationMinutes());
//        record.setIntensity(input.getIntensity());
//        record.setSets(input.getSets());
//        record.setReps(input.getReps()); // 횟수 설정
//        record.setWeight(input.getWeight());
//        record.setMemo(input.getMemo());
//        record.setSatisfaction(input.getSatisfaction());
//        record.setExerciseDate(input.getExerciseDate()); // 운동 날짜 설정
//        record.setModifiedDate(LocalDateTime.now());
//        return record;
//    }
}
