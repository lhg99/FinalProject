package backend.goorm.diet.entity;

import backend.goorm.member.model.entity.Member;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "diet_memo")
public class DietMemo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "memo_id")
    private Long memoId;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "dietMemo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Diet> diets;


    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;


}
