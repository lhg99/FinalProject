package backend.goorm.member.auth;

import backend.goorm.member.model.entity.Member;
import backend.goorm.member.oauth.PrincipalDetails;
import backend.goorm.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomMemberDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("userName == {}" , username);
        Member member = memberRepository.findByLoginId(username).orElseThrow(() -> {
            return new UsernameNotFoundException("회원 정보를 찾을 수 없습니다.");
        });
        return new PrincipalDetails(member, null, true);
    }
}
