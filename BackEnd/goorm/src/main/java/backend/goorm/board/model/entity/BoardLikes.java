package backend.goorm.board.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BoardLikes{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long BoardLikesId;

    private Long memberId;

    private Long boardId;
}
