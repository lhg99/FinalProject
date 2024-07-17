package backend.goorm.member.repository;

import backend.goorm.member.model.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByLoginId(String loginId);

    Optional<Member> findBySocialId(String socialId);

    Optional<Member> findByMemberId(Long memberId);

    Optional<Member> findByMemberEmail(String email);

    Optional<Member> findByMemberPhone(String phone);

    Optional<Member> findByMemberNickname(String nickname);

    @Query("SELECT m FROM Member m WHERE m.loginId = :loginId OR m.memberEmail = :memberEmail OR m.memberNickname = :memberNickname")
    Optional<Member> findDuplicate(@Param("loginId") String loginId,
                                                                @Param("memberEmail") String memberEmail,
                                                                @Param("memberNickname") String memberNickname);

}
