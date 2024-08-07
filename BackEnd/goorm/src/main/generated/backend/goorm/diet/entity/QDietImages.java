package backend.goorm.diet.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QDietImages is a Querydsl query type for DietImages
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QDietImages extends EntityPathBase<DietImages> {

    private static final long serialVersionUID = -2139777373L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QDietImages dietImages = new QDietImages("dietImages");

    public final QDiet diet;

    public final NumberPath<Long> dietImageId = createNumber("dietImageId", Long.class);

    public final StringPath imageUrl = createString("imageUrl");

    public QDietImages(String variable) {
        this(DietImages.class, forVariable(variable), INITS);
    }

    public QDietImages(Path<? extends DietImages> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QDietImages(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QDietImages(PathMetadata metadata, PathInits inits) {
        this(DietImages.class, metadata, inits);
    }

    public QDietImages(Class<? extends DietImages> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.diet = inits.isInitialized("diet") ? new QDiet(forProperty("diet"), inits.get("diet")) : null;
    }

}

