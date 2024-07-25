package backend.goorm.board.repository;

import backend.goorm.board.model.entity.Board;
import backend.goorm.board.model.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c JOIN FETCH c.memberId WHERE c.boardId = :board AND c.commentDeleted = false")
    List<Comment> findByBoardAndNotDeleted(@Param("board") Board board);

    Optional<Comment> findByCommentId(Long commentId);
}
