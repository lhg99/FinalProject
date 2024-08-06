package backend.goorm.record.repository;

import backend.goorm.member.model.entity.Member;
import backend.goorm.record.entity.Memo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface MemoRepository extends JpaRepository<Memo, Long> {
    Optional<Memo> findByDateAndMember(LocalDate date, Member member);
}
