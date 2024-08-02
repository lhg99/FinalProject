package backend.goorm.diet.repository;

import backend.goorm.diet.entity.Diet;
import backend.goorm.diet.entity.Food;
import backend.goorm.member.model.entity.Member;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DietRepository extends JpaRepository<Diet, Long> {
    List<Food> findDistinctFoodByMember(Member member, Pageable pageRequest);

    List<Diet> findByMemberAndDietDate(Member member, LocalDate date);

    List<Diet> findByDietDate(LocalDate dietDate);
}