package backend.goorm.training.repository;

import backend.goorm.training.model.entity.TrainingCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrainingCategoryRepository extends JpaRepository<TrainingCategory, Long> {
    // Optional<TrainingCategory> findByIdAndCategoryName(Long id, TrainingCategoryType categoryName); // 제거
}
