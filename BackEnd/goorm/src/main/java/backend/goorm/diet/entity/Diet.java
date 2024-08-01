package backend.goorm.diet.entity;

import backend.goorm.diet.enums.MealType;
import backend.goorm.member.model.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "diet")
public class Diet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diet_id")
    private Long dietId;

    @ManyToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @JoinColumn(name = "food_id")
    private Food food;

    private Float count;

    @Column(name = "meal_time")
    @Enumerated(EnumType.STRING)
    private MealType mealType;

    @Column(name = "diet_date")
    private LocalDate dietDate;

    @Column(name = "quantity")
    private Float quantity;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;
}