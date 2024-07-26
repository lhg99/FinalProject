package backend.goorm.training.repository;

import backend.goorm.training.model.entity.Training;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingRepository extends JpaRepository<Training, Long> {
    boolean existsByTrainingName(String trainingName);

}
