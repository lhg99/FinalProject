package backend.goorm.record.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRecord is a Querydsl query type for Record
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRecord extends EntityPathBase<Record> {

    private static final long serialVersionUID = -1606753531L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRecord record = new QRecord("record");

    public final NumberPath<Float> caloriesBurned = createNumber("caloriesBurned", Float.class);

    public final NumberPath<Float> distance = createNumber("distance", Float.class);

    public final NumberPath<Integer> durationMinutes = createNumber("durationMinutes", Integer.class);

    public final DatePath<java.time.LocalDate> exerciseDate = createDate("exerciseDate", java.time.LocalDate.class);

    public final NumberPath<Float> incline = createNumber("incline", Float.class);

    public final StringPath intensity = createString("intensity");

    public final StringPath memo = createString("memo");

    public final DateTimePath<java.time.LocalDateTime> modifiedDate = createDateTime("modifiedDate", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> recordDate = createDateTime("recordDate", java.time.LocalDateTime.class);

    public final NumberPath<Long> recordId = createNumber("recordId", Long.class);

    public final ListPath<RecordImages, QRecordImages> recordImages = this.<RecordImages, QRecordImages>createList("recordImages", RecordImages.class, QRecordImages.class, PathInits.DIRECT2);

    public final NumberPath<Integer> reps = createNumber("reps", Integer.class);

    public final NumberPath<Integer> satisfaction = createNumber("satisfaction", Integer.class);

    public final NumberPath<Integer> sets = createNumber("sets", Integer.class);

    public final backend.goorm.training.model.entity.QTraining training;

    public final NumberPath<Integer> weight = createNumber("weight", Integer.class);

    public QRecord(String variable) {
        this(Record.class, forVariable(variable), INITS);
    }

    public QRecord(Path<? extends Record> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRecord(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRecord(PathMetadata metadata, PathInits inits) {
        this(Record.class, metadata, inits);
    }

    public QRecord(Class<? extends Record> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.training = inits.isInitialized("training") ? new backend.goorm.training.model.entity.QTraining(forProperty("training"), inits.get("training")) : null;
    }

}

