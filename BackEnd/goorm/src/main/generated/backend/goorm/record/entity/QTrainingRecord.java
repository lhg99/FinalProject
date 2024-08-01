package backend.goorm.record.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTrainingRecord is a Querydsl query type for TrainingRecord
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTrainingRecord extends EntityPathBase<TrainingRecord> {

    private static final long serialVersionUID = 1054890111L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTrainingRecord trainingRecord = new QTrainingRecord("trainingRecord");

    public final QRecord record;

    public final backend.goorm.training.model.entity.QTraining training;

    public final NumberPath<Long> trainingRecordId = createNumber("trainingRecordId", Long.class);

    public QTrainingRecord(String variable) {
        this(TrainingRecord.class, forVariable(variable), INITS);
    }

    public QTrainingRecord(Path<? extends TrainingRecord> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTrainingRecord(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTrainingRecord(PathMetadata metadata, PathInits inits) {
        this(TrainingRecord.class, metadata, inits);
    }

    public QTrainingRecord(Class<? extends TrainingRecord> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.record = inits.isInitialized("record") ? new QRecord(forProperty("record"), inits.get("record")) : null;
        this.training = inits.isInitialized("training") ? new backend.goorm.training.model.entity.QTraining(forProperty("training"), inits.get("training")) : null;
    }

}

