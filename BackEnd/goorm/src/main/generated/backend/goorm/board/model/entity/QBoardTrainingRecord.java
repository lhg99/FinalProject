package backend.goorm.board.model.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QBoardTrainingRecord is a Querydsl query type for BoardTrainingRecord
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBoardTrainingRecord extends EntityPathBase<BoardTrainingRecord> {

    private static final long serialVersionUID = 155528985L;

    public static final QBoardTrainingRecord boardTrainingRecord = new QBoardTrainingRecord("boardTrainingRecord");

    public final NumberPath<Long> boardId = createNumber("boardId", Long.class);

    public final NumberPath<Long> boardTRId = createNumber("boardTRId", Long.class);

    public final NumberPath<Long> recordId = createNumber("recordId", Long.class);

    public QBoardTrainingRecord(String variable) {
        super(BoardTrainingRecord.class, forVariable(variable));
    }

    public QBoardTrainingRecord(Path<? extends BoardTrainingRecord> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBoardTrainingRecord(PathMetadata metadata) {
        super(BoardTrainingRecord.class, metadata);
    }

}

