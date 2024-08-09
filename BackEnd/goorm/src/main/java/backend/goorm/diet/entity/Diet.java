package backend.goorm.diet.entity;

import backend.goorm.diet.enums.MealTime;
import backend.goorm.member.model.entity.Member;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "diet")
public class Diet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diet_id")
    private Long dietId;

    @ManyToOne
    @JoinColumn(name = "food_id")
    private Food food;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "memo_id")
    private DietMemo dietMemo;

    @Column(name = "quantity")
    private Float quantity;

    @Column(name = "gram")
    private Float gram;

    @Column(name = "total_calories")
    private Float totalCalories;

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_time", nullable = false)
    private MealTime mealTime;

    @Column(name = "diet_date", nullable = false)
    private LocalDate dietDate;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    // 총 칼로리를 계산하고 설정하는 메서드
    public void calculateTotalCalories() {
        if (gram != null && gram > 0) {
            this.totalCalories = food.getCalories() / food.getGram() * gram;
        } else if (quantity != null && quantity > 0) {
            this.totalCalories = food.getCalories() * quantity;
        } else {
            this.totalCalories = 0.0f;
        }
    }
}
