package backend.goorm.board.repository;

import backend.goorm.board.model.entity.BoardImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardImageRepository extends JpaRepository<BoardImages, Long> {

    @Query("SELECT bi.imageUrl FROM BoardImages bi WHERE bi.boardId = :boardId")
    List<String> findImageUrlsByBoardId(@Param("boardId") Long boardId);

    void deleteByBoardId(Long boardId);
}
