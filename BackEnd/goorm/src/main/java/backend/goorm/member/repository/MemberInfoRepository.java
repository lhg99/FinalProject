package backend.goorm.member.repository;

import backend.goorm.member.model.entity.Member;
import backend.goorm.member.model.entity.MemberInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberInfoRepository extends JpaRepository<MemberInfo, Long> {

    Optional<MemberInfo> findByMemberId(Member memberId);

    @Query("SELECT mi FROM MemberInfo mi JOIN FETCH mi.memberId WHERE mi.memberId = :member")
    Optional<MemberInfo> findByIdWithMember(@Param("member") Member member);
}
