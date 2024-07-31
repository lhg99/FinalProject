package backend.goorm.record.entity;

import backend.goorm.member.model.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class BodyPartCountRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRAINING_RECORD_ID")
    private TrainingRecord trainingRecord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private LocalDate date;

    private boolean weeklyRecordedYn;

    private double chest;
    private double back;
    private double legs;
    private double shoulder;
    private double biceps;
    private double triceps;
    private double abs;
    private double etc;

    @Builder
    public BodyPartCountRecord(double chest, double back, double legs, double shoulder, double biceps,
                               double triceps, double abs, double etc) {
        this.chest = chest;
        this.back = back;
        this.legs = legs;
        this.shoulder = shoulder;
        this.biceps = biceps;
        this.triceps = triceps;
        this.abs = abs;
        this.etc = etc;
    }

    @Override
    public String toString() {
        return "BodyPartCountRecord{" +
                "id=" + id +
                "date=" + date +
                ", chest=" + chest +
                ", back=" + back +
                ", legs=" + legs +
                ", shoulder=" + shoulder +
                ", biceps=" + biceps +
                ", triceps=" + triceps +
                ", etc=" + etc +
                '}';
    }
}