package backend.goorm.diet.repository;

import backend.goorm.diet.entity.DietMemo;
import backend.goorm.member.model.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DietMemoRepository extends JpaRepository<DietMemo, Long> {
    Optional<DietMemo> findByMemberAndDate(Member member, LocalDate date);
}
