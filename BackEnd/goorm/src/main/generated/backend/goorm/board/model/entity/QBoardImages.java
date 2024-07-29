package backend.goorm.board.model.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QBoardImages is a Querydsl query type for BoardImages
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBoardImages extends EntityPathBase<BoardImages> {

    private static final long serialVersionUID = -845608506L;

    public static final QBoardImages boardImages = new QBoardImages("boardImages");

    public final NumberPath<Long> boardId = createNumber("boardId", Long.class);

    public final NumberPath<Long> boardImageId = createNumber("boardImageId", Long.class);

    public final StringPath imageUrl = createString("imageUrl");

    public QBoardImages(String variable) {
        super(BoardImages.class, forVariable(variable));
    }

    public QBoardImages(Path<? extends BoardImages> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBoardImages(PathMetadata metadata) {
        super(BoardImages.class, metadata);
    }

}

