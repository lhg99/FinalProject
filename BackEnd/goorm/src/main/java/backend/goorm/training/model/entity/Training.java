package backend.goorm.training.model.entity;

import backend.goorm.record.TrainingRecord;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "training")
public class Training {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "training_id")
    private Long trainingId;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private TrainingCategory category;

    @Column(name = "training_name", nullable = false)
    private String trainingName;


    @Column(name = "user_register", nullable = false)
    private Boolean user_custom = false;

    @Column(name = "description")
    private String description;

    @Column(name = "calories_burned_per_minute")
    private Float caloriesBurnedPerMinute;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(mappedBy = "training")
    private List<TrainingRecord> trainingRecords;
}