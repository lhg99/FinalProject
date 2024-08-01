package backend.goorm.record.repository;

import backend.goorm.record.entity.WeeklyRecord;
import backend.goorm.member.model.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface WeeklyRecordRepository extends JpaRepository<WeeklyRecord, Long> {
    Optional<WeeklyRecord> findByMemberAndStartDateAndEndDate(Member member, LocalDate startDate, LocalDate endDate);
}
