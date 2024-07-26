package backend.goorm.diet.repository;

import backend.goorm.diet.entity.Food;
import backend.goorm.member.model.entity.Member;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Long> {

    List<Food> findDistinctFoodNameByMember(String name, Member member, Pageable pageable);


    List<Food> findDistinctFoodByMember( Member member, Pageable pageable);

    List<Food> findDistinctByFoodNameContainingAndMember(String name, Member member, Pageable pageable);
}
