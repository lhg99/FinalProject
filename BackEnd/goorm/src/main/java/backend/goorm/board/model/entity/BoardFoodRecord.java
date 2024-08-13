package backend.goorm.board.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class BoardFoodRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long boardFRId;

    private Long boardId;

    private Long foodRecordId;
}
