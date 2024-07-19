package backend.goorm.record.repository;


import backend.goorm.record.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecordRepository extends JpaRepository<Record, Long> {
    List<Record> findAll();
    List<Record> findByTraining_TrainingId(Long trainingId);
}
