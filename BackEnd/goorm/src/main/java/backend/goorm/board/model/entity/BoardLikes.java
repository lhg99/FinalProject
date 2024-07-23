package backend.goorm.board.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class BoardLikes{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long BoardLikesId;

    private Long memberId;

    private Long boardId;
}
