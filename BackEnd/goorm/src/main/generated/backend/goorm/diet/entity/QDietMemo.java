package backend.goorm.diet.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QDietMemo is a Querydsl query type for DietMemo
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QDietMemo extends EntityPathBase<DietMemo> {

    private static final long serialVersionUID = -1932838875L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QDietMemo dietMemo = new QDietMemo("dietMemo");

    public final StringPath content = createString("content");

    public final DatePath<java.time.LocalDate> createdAt = createDate("createdAt", java.time.LocalDate.class);

    public final DatePath<java.time.LocalDate> date = createDate("date", java.time.LocalDate.class);

    public final backend.goorm.member.model.entity.QMember member;

    public final NumberPath<Long> memoId = createNumber("memoId", Long.class);

    public QDietMemo(String variable) {
        this(DietMemo.class, forVariable(variable), INITS);
    }

    public QDietMemo(Path<? extends DietMemo> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QDietMemo(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QDietMemo(PathMetadata metadata, PathInits inits) {
        this(DietMemo.class, metadata, inits);
    }

    public QDietMemo(Class<? extends DietMemo> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new backend.goorm.member.model.entity.QMember(forProperty("member")) : null;
    }

}

