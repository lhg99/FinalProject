package backend.goorm.diet.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QDiet is a Querydsl query type for Diet
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QDiet extends EntityPathBase<Diet> {

    private static final long serialVersionUID = -347354037L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QDiet diet = new QDiet("diet");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final DatePath<java.time.LocalDate> dietDate = createDate("dietDate", java.time.LocalDate.class);

    public final NumberPath<Long> dietId = createNumber("dietId", Long.class);

    public final ListPath<DietImages, QDietImages> dietImages = this.<DietImages, QDietImages>createList("dietImages", DietImages.class, QDietImages.class, PathInits.DIRECT2);

    public final QFood food;

    public final EnumPath<backend.goorm.diet.enums.MealTime> mealTime = createEnum("mealTime", backend.goorm.diet.enums.MealTime.class);

    public final backend.goorm.member.model.entity.QMember member;

    public final NumberPath<Float> quantity = createNumber("quantity", Float.class);

    public QDiet(String variable) {
        this(Diet.class, forVariable(variable), INITS);
    }

    public QDiet(Path<? extends Diet> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QDiet(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QDiet(PathMetadata metadata, PathInits inits) {
        this(Diet.class, metadata, inits);
    }

    public QDiet(Class<? extends Diet> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.food = inits.isInitialized("food") ? new QFood(forProperty("food"), inits.get("food")) : null;
        this.member = inits.isInitialized("member") ? new backend.goorm.member.model.entity.QMember(forProperty("member")) : null;
    }

}

