package backend.goorm.board.repository;

import backend.goorm.board.model.entity.BoardDietRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardDietRecordRepository extends JpaRepository<BoardDietRecord, Long> {

    @Query("SELECT b.dietId FROM BoardDietRecord b WHERE b.boardId = :boardId")
    List<Long> findRecordIdsByBoardId(@Param("boardId") Long boardId);
}
