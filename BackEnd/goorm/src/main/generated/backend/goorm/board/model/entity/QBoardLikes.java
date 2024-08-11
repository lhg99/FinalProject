package backend.goorm.board.model.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QBoardLikes is a Querydsl query type for BoardLikes
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBoardLikes extends EntityPathBase<BoardLikes> {

    private static final long serialVersionUID = -1687184722L;

    public static final QBoardLikes boardLikes = new QBoardLikes("boardLikes");

    public final NumberPath<Long> boardId = createNumber("boardId", Long.class);

    public final NumberPath<Long> BoardLikesId = createNumber("BoardLikesId", Long.class);

    public final NumberPath<Long> memberId = createNumber("memberId", Long.class);

    public QBoardLikes(String variable) {
        super(BoardLikes.class, forVariable(variable));
    }

    public QBoardLikes(Path<? extends BoardLikes> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBoardLikes(PathMetadata metadata) {
        super(BoardLikes.class, metadata);
    }

}

