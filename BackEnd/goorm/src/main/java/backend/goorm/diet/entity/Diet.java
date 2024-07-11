package backend.goorm.diet.entity;

import backend.goorm.diet.enums.MealTime;
import backend.goorm.member.model.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "diet")
public class Diet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diet_id")
    private Long dietId;

//    @ManyToOne
//    @JoinColumn(name = "member_id")
//    private Member member;

    @ManyToOne
    @JoinColumn(name = "food_id")
    private Food food;

    @Column(name = "meal_time")
    @Enumerated(EnumType.STRING)
    private MealTime mealTime;

    @Column(name = "diet_date")
    private LocalDate dietDate;

    @Column(name = "quantity")
    private Float quantity;
}