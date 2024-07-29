package backend.goorm.training.model.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTrainingCategory is a Querydsl query type for TrainingCategory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTrainingCategory extends EntityPathBase<TrainingCategory> {

    private static final long serialVersionUID = -763143056L;

    public static final QTrainingCategory trainingCategory = new QTrainingCategory("trainingCategory");

    public final NumberPath<Long> categoryId = createNumber("categoryId", Long.class);

    public final EnumPath<backend.goorm.training.model.enums.TrainingCategoryType> categoryName = createEnum("categoryName", backend.goorm.training.model.enums.TrainingCategoryType.class);

    public final ListPath<Training, QTraining> trainings = this.<Training, QTraining>createList("trainings", Training.class, QTraining.class, PathInits.DIRECT2);

    public QTrainingCategory(String variable) {
        super(TrainingCategory.class, forVariable(variable));
    }

    public QTrainingCategory(Path<? extends TrainingCategory> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTrainingCategory(PathMetadata metadata) {
        super(TrainingCategory.class, metadata);
    }

}

