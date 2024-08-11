package backend.goorm.diet.repository;

import backend.goorm.diet.entity.Food;
import backend.goorm.member.model.entity.Member;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Long> {

    @Query(
            "SELECT f"
                    + " FROM Food f"
                    + " WHERE f.foodName LIKE %?1%"
                    + " ORDER BY LENGTH(f.foodName), f.foodName")
    List<Food> findDistinctFoodNameByMember(String name, Member member, Pageable pageable);

}
