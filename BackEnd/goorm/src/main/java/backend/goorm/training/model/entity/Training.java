package backend.goorm.training.model.entity;

import backend.goorm.training.model.enums.TrainingStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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

    @Column(name = "training_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private TrainingStatus trainingStatus;

    @Column(name = "description")
    private String description;

    @Column(name = "calories_burned_per_minute")
    private Float caloriesBurnedPerMinute;

    @Column(name = "image_url")
    private String imageUrl;

//    @OneToMany(mappedBy = "training")
//    private List<TrainingRecord> trainingRecords;
}