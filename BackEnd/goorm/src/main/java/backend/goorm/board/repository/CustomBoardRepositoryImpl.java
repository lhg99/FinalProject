package backend.goorm.board.repository;

import backend.goorm.board.model.entity.Board;
import backend.goorm.board.model.entity.QBoard;
import backend.goorm.board.model.entity.QComment;
import backend.goorm.board.model.enums.BoardCategory;
import backend.goorm.board.model.enums.BoardSortType;
import backend.goorm.board.model.enums.BoardType;
import backend.goorm.member.model.entity.QMember;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CustomBoardRepositoryImpl implements CustomBoardRepository{

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<Board> getBoardList(BoardType type, List<BoardCategory> categories, BoardSortType sortType, String keyword, Pageable pageable) {
        QBoard board = QBoard.board;
        QMember member = QMember.member;
        QComment comment = QComment.comment;

        JPQLQuery<Board> query = queryFactory.selectFrom(board)
                .join(board.memberId, member).fetchJoin()
                .leftJoin(board.comments, comment).fetchJoin()
                .where(board.boardType.eq(type)
                        .and(categories.isEmpty() ? null : board.boardCategory.in(categories))
                        .and(board.boardDeleted.eq(false))
                        .and(keyword.isEmpty() ? null :(
                            board.boardTitle.containsIgnoreCase(keyword)
                                    .or(board.boardContent.containsIgnoreCase(keyword))
                                    .or(comment.commentContent.containsIgnoreCase(keyword))
                        ))
                );

        switch (sortType) {
            case DATE_ASC:
                query.orderBy(board.boardRegDate.asc());
                break;
            case DATE_DESC:
                query.orderBy(board.boardRegDate.desc());
                break;
            case LIKES_ASC:
                query.orderBy(board.likesCnt.asc());
                break;
            case LIKES_DESC:
                query.orderBy(board.likesCnt.desc());
                break;
            case VIEW_ASC:
                query.orderBy(board.viewCnt.asc());
                break;
            case VIEW_DESC:
                query.orderBy(board.viewCnt.desc());
                break;
        }

        long total = query.fetchCount();
        List<Board> results = query.offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(results, pageable, results.size());
    }
}
