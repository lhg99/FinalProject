package backend.goorm.record.repository;


import backend.goorm.member.model.entity.Member;
import backend.goorm.record.entity.Record;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Repository
public interface RecordRepository extends JpaRepository<Record, Long> {
    List<Record> findAll();
    List<Record> findByTraining_TrainingId(Long trainingId);

    Page<Record> findAllByMember(Member member, Pageable pageable);

    Page<Record> findByExerciseDateBetweenAndMember(LocalDate start, LocalDate end, Member member, Pageable pageable);

    List<Record> findAllByExerciseDateAndMember(LocalDate date, Member member);
}
