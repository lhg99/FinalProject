package backend.goorm.board.repository;

import backend.goorm.board.model.entity.BoardLikes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardLikesRepository extends JpaRepository<BoardLikes, Long> {

    Optional<BoardLikes> findByBoardIdAndMemberId(Long boardId, Long memberId);

}
