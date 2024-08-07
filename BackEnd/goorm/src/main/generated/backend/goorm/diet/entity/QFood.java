package backend.goorm.diet.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QFood is a Querydsl query type for Food
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QFood extends EntityPathBase<Food> {

    private static final long serialVersionUID = -347288395L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QFood food = new QFood("food");

    public final NumberPath<Double> amount = createNumber("amount", Double.class);

    public final NumberPath<Float> calories = createNumber("calories", Float.class);

    public final NumberPath<Float> carbohydrate = createNumber("carbohydrate", Float.class);

    public final NumberPath<Float> cholesterol = createNumber("cholesterol", Float.class);

    public final ListPath<Diet, QDiet> diets = this.<Diet, QDiet>createList("diets", Diet.class, QDiet.class, PathInits.DIRECT2);

    public final NumberPath<Float> fat = createNumber("fat", Float.class);

    public final NumberPath<Long> foodId = createNumber("foodId", Long.class);

    public final StringPath foodName = createString("foodName");

    public final StringPath foodType = createString("foodType");

    public final NumberPath<Float> gram = createNumber("gram", Float.class);

    public final backend.goorm.member.model.entity.QMember member;

    public final NumberPath<Float> protein = createNumber("protein", Float.class);

    public final NumberPath<Float> salt = createNumber("salt", Float.class);

    public final NumberPath<Float> saturatedFat = createNumber("saturatedFat", Float.class);

    public final NumberPath<Float> sugar = createNumber("sugar", Float.class);

    public final NumberPath<Float> transFat = createNumber("transFat", Float.class);

    public final NumberPath<Integer> useCount = createNumber("useCount", Integer.class);

    public final BooleanPath userRegister = createBoolean("userRegister");

    public QFood(String variable) {
        this(Food.class, forVariable(variable), INITS);
    }

    public QFood(Path<? extends Food> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QFood(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QFood(PathMetadata metadata, PathInits inits) {
        this(Food.class, metadata, inits);
    }

    public QFood(Class<? extends Food> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new backend.goorm.member.model.entity.QMember(forProperty("member")) : null;
    }

}

