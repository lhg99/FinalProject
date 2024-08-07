package backend.goorm.record.repository;

import backend.goorm.record.entity.WeeklyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BodyPartCountRecordRepository extends JpaRepository<WeeklyRecord, Long> {
    List<WeeklyRecord> findAllByStartDateAndEndDate(LocalDate startDate, LocalDate endDate);
}
