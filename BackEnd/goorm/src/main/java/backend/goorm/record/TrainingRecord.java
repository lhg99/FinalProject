package backend.goorm.record;

import backend.goorm.training.model.entity.Training;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "training_record")
public class TrainingRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "training_record_id")
    private Long trainingRecordId;

    @ManyToOne
    @JoinColumn(name = "record_id")
    private Record record;

    @ManyToOne
    @JoinColumn(name = "training_id")
    private Training training;
}