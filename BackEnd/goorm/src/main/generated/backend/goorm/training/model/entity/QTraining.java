package backend.goorm.training.model.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTraining is a Querydsl query type for Training
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTraining extends EntityPathBase<Training> {

    private static final long serialVersionUID = -1246253742L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTraining training = new QTraining("training");

    public final NumberPath<Float> caloriesBurnedPerMinute = createNumber("caloriesBurnedPerMinute", Float.class);

    public final QTrainingCategory category;

    public final StringPath description = createString("description");

    public final StringPath imageUrl = createString("imageUrl");

    public final NumberPath<Long> trainingId = createNumber("trainingId", Long.class);

    public final StringPath trainingName = createString("trainingName");

    public final ListPath<backend.goorm.record.entity.Record, backend.goorm.record.entity.QRecord> trainingRecords = this.<backend.goorm.record.entity.Record, backend.goorm.record.entity.QRecord>createList("trainingRecords", backend.goorm.record.entity.Record.class, backend.goorm.record.entity.QRecord.class, PathInits.DIRECT2);

    public final BooleanPath userCustom = createBoolean("userCustom");

    public QTraining(String variable) {
        this(Training.class, forVariable(variable), INITS);
    }

    public QTraining(Path<? extends Training> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTraining(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTraining(PathMetadata metadata, PathInits inits) {
        this(Training.class, metadata, inits);
    }

    public QTraining(Class<? extends Training> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.category = inits.isInitialized("category") ? new QTrainingCategory(forProperty("category")) : null;
    }

}

