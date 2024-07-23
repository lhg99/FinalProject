package backend.goorm.board.repository;

import backend.goorm.board.model.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {

    @Query("SELECT b FROM Board b JOIN FETCH b.memberId m WHERE b.boardId = :boardId AND b.boardDeleted = false")
    Optional<Board> findBoardByIdAndNotDeleted(@Param("boardId") Long boardId);

}
