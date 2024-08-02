package backend.goorm.training.model.entity;

import backend.goorm.record.entity.Record;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
    private Boolean userCustom = false;

    @Column(name = "description")
    private String description;

    @Column(name = "calories_burned_per_minute")
    private Float caloriesBurnedPerMinute;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(mappedBy = "training")
    @JsonIgnore
    private List<Record> trainingRecords;
}
