package backend.goorm.training.model.entity;

import backend.goorm.training.model.enums.TrainingCategoryType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "training_category")
public class TrainingCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Enumerated(EnumType.STRING)
    @Column(name = "category_name", nullable = false)
    private TrainingCategoryType categoryName;

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<Training> trainings;
}
