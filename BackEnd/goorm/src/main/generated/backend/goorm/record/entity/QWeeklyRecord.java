package backend.goorm.record.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QWeeklyRecord is a Querydsl query type for WeeklyRecord
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QWeeklyRecord extends EntityPathBase<WeeklyRecord> {

    private static final long serialVersionUID = 1929663462L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QWeeklyRecord weeklyRecord = new QWeeklyRecord("weeklyRecord");

    public final NumberPath<Double> abs = createNumber("abs", Double.class);

    public final NumberPath<Double> back = createNumber("back", Double.class);

    public final NumberPath<Double> biceps = createNumber("biceps", Double.class);

    public final NumberPath<Double> cardio = createNumber("cardio", Double.class);

    public final NumberPath<Double> chest = createNumber("chest", Double.class);

    public final DatePath<java.time.LocalDate> endDate = createDate("endDate", java.time.LocalDate.class);

    public final NumberPath<Double> etc = createNumber("etc", Double.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Double> legs = createNumber("legs", Double.class);

    public final backend.goorm.member.model.entity.QMember member;

    public final NumberPath<Double> shoulder = createNumber("shoulder", Double.class);

    public final DatePath<java.time.LocalDate> startDate = createDate("startDate", java.time.LocalDate.class);

    public final NumberPath<Integer> trainingPerWeek = createNumber("trainingPerWeek", Integer.class);

    public final NumberPath<Double> triceps = createNumber("triceps", Double.class);

    public QWeeklyRecord(String variable) {
        this(WeeklyRecord.class, forVariable(variable), INITS);
    }

    public QWeeklyRecord(Path<? extends WeeklyRecord> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QWeeklyRecord(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QWeeklyRecord(PathMetadata metadata, PathInits inits) {
        this(WeeklyRecord.class, metadata, inits);
    }

    public QWeeklyRecord(Class<? extends WeeklyRecord> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new backend.goorm.member.model.entity.QMember(forProperty("member")) : null;
    }

}

