package backend.goorm.diet.repository;

import backend.goorm.diet.entity.Diet;
import backend.goorm.diet.entity.Food;
import backend.goorm.member.model.entity.Member;
import backend.goorm.record.entity.Record;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface DietRepository extends JpaRepository<Diet, Long> {
    List<Food> findDistinctFoodByMember(Member member, Pageable pageRequest);

    List<Diet> findByDietDateAndMember(LocalDate date, Member member);

    List<Diet> findByMember(Member member);

    @Query("SELECT d FROM Diet d " +
            "JOIN FETCH d.food f " +
            "JOIN FETCH d.dietMemo dm " +
            "WHERE d.dietId IN :dietIds")
    List<Diet> findDietWithFoodAndDietMemoByDietIds(List<Long> dietIds);
}