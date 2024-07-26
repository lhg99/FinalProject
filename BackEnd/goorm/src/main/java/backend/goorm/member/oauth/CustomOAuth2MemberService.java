package backend.goorm.member.oauth;

import backend.goorm.member.model.entity.Member;
import backend.goorm.member.model.enums.MemberRole;
import backend.goorm.member.model.enums.MemberType;
import backend.goorm.member.oauth.dto.OAuth2MemberInfoFactory;
import backend.goorm.member.oauth.dto.OauthMemberInfo;
import backend.goorm.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.net.http.HttpResponse;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2MemberService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 1. 유저 정보(attributes) 가져오기
        Map<String, Object> oAuth2UserAttributes = super.loadUser(userRequest).getAttributes();

        // 2.OAuth2 user dto 생성
        OauthMemberInfo oAuth2MemberInfo = OAuth2MemberInfoFactory.getOAuth2UserInfo(userRequest, oAuth2UserAttributes);

        log.info(oAuth2MemberInfo.getProviderId());

        // 기존에 회원가입을 진행한 유저인지 아닌지 확인하는 과정
        Optional<Member> socialMember = memberRepository.findBySocialIdAndActive(oAuth2MemberInfo.getProviderId());

        /**
         * CASE 1. 회원 등록 자체가 안되어 있을 경우
         */
        if(!socialMember.isPresent()){
            log.info("회원 등록이 되어있지 않은 사용자. 임시 회원 등록 후 회원가입 페이지로 이동합니다");

            Member tempMember = Member.builder()
                    .memberName("temp")
                    .memberEmail(oAuth2MemberInfo.getEmail())
                    .memberNickname(oAuth2MemberInfo.getNickname())
                    .memberPhone("temp")
                    .role(MemberRole.MEMBER)
                    .socialId(oAuth2MemberInfo.getProviderId())
                    .memberType(MemberType.SOCIAL)
                    .build();

            Member saveMember = memberRepository.save(tempMember);

            return new PrincipalDetails(saveMember, oAuth2UserAttributes, false);

        }else{

            /**
             * CASE 2. 임시 회원 등록은 되어있지만 회원 가입 도중 문제가 생겨 정상적으로 회원가입이 되어있지 않은 회원
             * CASE 3. 회원 가입이 이미 정상적으로 완료된 회원
             * [ 구분 방법 ] : 데이터 베이스 필드를 통해 구분해준다
             */
            return new PrincipalDetails(socialMember.get(), oAuth2UserAttributes, socialMember.get().isMemberRegistered());
        }

    }

}
