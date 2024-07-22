package backend.goorm.diet.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "food")
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "food_id")
    private Long foodId;

    @Column(name = "food_name", nullable = false)
    private String foodName;

    @Column(nullable = false)
    private Double amount;

    @Column(name = "calories")
    private Float calories;

    @Column(name = "carbohydrate")
    private Float carbohydrate;

    @Column(name = "protein")
    private Float protein;

    @Column(name = "fat")
    private Float fat;

    @Column(name = "user_register", nullable = false)
    private Boolean userRegister = false;

    @Column(name = "serving_size")
    private Float servingSize;

    @Column(name = "use_count", nullable = false)
    private Integer useCount = 0;

    @OneToMany(mappedBy = "food")
    private List<Diet> diets;
}