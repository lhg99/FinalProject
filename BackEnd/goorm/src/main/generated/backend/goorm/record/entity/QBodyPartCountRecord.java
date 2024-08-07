package backend.goorm.record.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBodyPartCountRecord is a Querydsl query type for BodyPartCountRecord
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBodyPartCountRecord extends EntityPathBase<BodyPartCountRecord> {

    private static final long serialVersionUID = 106927127L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBodyPartCountRecord bodyPartCountRecord = new QBodyPartCountRecord("bodyPartCountRecord");

    public final NumberPath<Double> abs = createNumber("abs", Double.class);

    public final NumberPath<Double> back = createNumber("back", Double.class);

    public final NumberPath<Double> biceps = createNumber("biceps", Double.class);

    public final NumberPath<Double> chest = createNumber("chest", Double.class);

    public final DatePath<java.time.LocalDate> date = createDate("date", java.time.LocalDate.class);

    public final NumberPath<Double> etc = createNumber("etc", Double.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Double> legs = createNumber("legs", Double.class);

    public final backend.goorm.member.model.entity.QMember member;

    public final NumberPath<Double> shoulder = createNumber("shoulder", Double.class);

    public final QTrainingRecord trainingRecord;

    public final NumberPath<Double> triceps = createNumber("triceps", Double.class);

    public final BooleanPath weeklyRecordedYn = createBoolean("weeklyRecordedYn");

    public QBodyPartCountRecord(String variable) {
        this(BodyPartCountRecord.class, forVariable(variable), INITS);
    }

    public QBodyPartCountRecord(Path<? extends BodyPartCountRecord> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBodyPartCountRecord(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBodyPartCountRecord(PathMetadata metadata, PathInits inits) {
        this(BodyPartCountRecord.class, metadata, inits);
    }

    public QBodyPartCountRecord(Class<? extends BodyPartCountRecord> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new backend.goorm.member.model.entity.QMember(forProperty("member")) : null;
        this.trainingRecord = inits.isInitialized("trainingRecord") ? new QTrainingRecord(forProperty("trainingRecord"), inits.get("trainingRecord")) : null;
    }

}

