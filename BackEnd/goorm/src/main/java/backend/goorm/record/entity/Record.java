package backend.goorm.record.entity;

import backend.goorm.training.model.entity.Training;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "record")
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Long recordId;

    @ManyToOne
    @JoinColumn(name = "training_id")
    private Training training;

    @Column(name = "record_date", nullable = false)
    private LocalDateTime recordDate;

    @Column(name = "exercise_date", nullable = false)
    private LocalDate exerciseDate;

    @Column(name = "modified_date")
    private LocalDateTime modifiedDate;

    @Column(name = "calories_burned", nullable = true)
    private Float caloriesBurned;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "intensity")
    private String intensity;

    @Column(name = "sets")
    private Integer sets;

    @Column(name = "reps")
    private Integer reps;

    @Column(name = "weight")
    private Integer weight;

    @Column(name = "distance")
    private Float distance;

    @Column(name = "incline")
    private Float incline;

    @Column(name = "memo", length = 1000)
    private String memo;

    @Column(name = "satisfaction")
    private Integer satisfaction;

    private String imageUrl;

    @Builder
    public Record(Training training, LocalDateTime recordDate, LocalDateTime modifiedDate,
                  Float caloriesBurned, Integer durationMinutes, String intensity, Integer sets,
                  Integer weight, Float distance, Float incline, LocalDate exerciseDate,
                  String memo, Integer satisfaction, String imageUrl) {
        this.training = training;
        this.recordDate = recordDate;
        this.modifiedDate = modifiedDate;
        this.caloriesBurned = caloriesBurned;
        this.durationMinutes = durationMinutes;
        this.intensity = intensity;
        this.sets = sets;
        this.weight = weight;
        this.distance = distance;
        this.incline = incline;
        this.exerciseDate = exerciseDate;
        this.memo = memo;
        this.satisfaction = satisfaction;
        this.imageUrl = imageUrl;
    }
}
