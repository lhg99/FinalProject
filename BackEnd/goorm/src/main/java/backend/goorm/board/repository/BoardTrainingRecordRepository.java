package backend.goorm.board.repository;

import backend.goorm.board.model.entity.BoardTrainingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardTrainingRecordRepository extends JpaRepository<BoardTrainingRecord, Long> {

    @Query("SELECT b.recordId FROM BoardTrainingRecord b WHERE b.boardId = :boardId")
    List<Long> findRecordIdsByBoardId(@Param("boardId") Long boardId);
}
