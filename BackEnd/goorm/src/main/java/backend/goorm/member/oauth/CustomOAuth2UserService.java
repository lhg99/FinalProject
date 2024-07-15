package backend.goorm.member.oauth;

import backend.goorm.member.model.entity.Member;
import backend.goorm.member.oauth.dto.OAuth2UserInfoFactory;
import backend.goorm.member.oauth.dto.OauthUserInfo;
import backend.goorm.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 1. 유저 정보(attributes) 가져오기
        Map<String, Object> oAuth2UserAttributes = super.loadUser(userRequest).getAttributes();

        // 4. 유저 정보 dto 생성
        OauthUserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(userRequest, oAuth2UserAttributes);

        log.info(oAuth2UserInfo.getNickname());

        // TODO:5. 회원가입 및 로그인
        Member member = Member.builder()
                .memberName("temp")
                .memberNickname("temp")
                .build();

        // 6. OAuth2User로 반환
        return new PrincipalDetails(member, oAuth2UserAttributes);
    }

}
