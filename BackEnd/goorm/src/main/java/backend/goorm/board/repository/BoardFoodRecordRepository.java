package backend.goorm.board.repository;

import backend.goorm.board.model.entity.BoardFoodRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardFoodRecordRepository extends JpaRepository<BoardFoodRecord, Long> {

    @Query("SELECT b.foodRecordId FROM BoardFoodRecord b WHERE b.boardId = :boardId")
    List<Long> findRecordIdsByBoardId(@Param("boardId") Long boardId);
}
