package backend.goorm.record.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRecordImages is a Querydsl query type for RecordImages
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRecordImages extends EntityPathBase<RecordImages> {

    private static final long serialVersionUID = -1098696227L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRecordImages recordImages = new QRecordImages("recordImages");

    public final StringPath imageUrl = createString("imageUrl");

    public final QRecord record;

    public final NumberPath<Long> recordImageId = createNumber("recordImageId", Long.class);

    public QRecordImages(String variable) {
        this(RecordImages.class, forVariable(variable), INITS);
    }

    public QRecordImages(Path<? extends RecordImages> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRecordImages(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRecordImages(PathMetadata metadata, PathInits inits) {
        this(RecordImages.class, metadata, inits);
    }

    public QRecordImages(Class<? extends RecordImages> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.record = inits.isInitialized("record") ? new QRecord(forProperty("record"), inits.get("record")) : null;
    }

}

