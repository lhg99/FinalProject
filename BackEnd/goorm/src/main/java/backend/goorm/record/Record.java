package backend.goorm.record;

import backend.goorm.member.model.entity.Member;
import backend.goorm.training.model.entity.Training;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "record")
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Long recordId;

//    @ManyToOne
//    @JoinColumn(name = "member_id")
//    private Member member;

    @ManyToOne
    @JoinColumn(name = "training_id")
    private Training training;

    @Column(name = "record_date", nullable = false)
    private LocalDateTime recordDate;

    @Column(name = "modified_date")
    private LocalDateTime modifiedDate;

    @Column(name = "calories_burned", nullable = false)
    private Float caloriesBurned;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Column(name = "intensity")
    private String intensity;

    @Column(name = "sets")
    private Integer sets;

    @Column(name = "weight")
    private Integer weight;

    @Column(name = "distance")
    private Float distance;

    @Column(name = "user_register", nullable = false)
    private Boolean userRegister;

    @Column(name = "memo", length = 1000)
    private String memo;

    @Column(name = "satisfaction")
    private Integer satisfaction;
}