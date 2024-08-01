package backend.goorm.diet.entity;

import backend.goorm.member.model.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "food")
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "food_id")
    private Long foodId;

    @Column(name = "food_name", nullable = false)
    private String foodName;

    private String foodType;

    private Double amount;

    @ManyToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private Float gram;

    @Column(name = "calories")
    private Float calories;

    @Column(name = "carbohydrate")
    private Float carbohydrate;

    @Column(name = "protein")
    private Float protein;

    @Column(name = "fat")
    private Float fat;

    private Float sugar;
    private Float salt;
    private Float cholesterol;
    private Float saturatedFat;
    private Float transFat;


    @Column(name = "user_register", nullable = false)
    private Boolean userRegister = false;


    @Column(name = "use_count", nullable = false)
    private Integer useCount = 0;

    @OneToMany(mappedBy = "food")
    private List<Diet> diets;
}
