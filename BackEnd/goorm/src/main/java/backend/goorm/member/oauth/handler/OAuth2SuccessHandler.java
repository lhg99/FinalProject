package backend.goorm.member.oauth.handler;

import backend.goorm.member.model.entity.Member;
import backend.goorm.member.model.entity.MemberInfo;
import backend.goorm.member.oauth.PrincipalDetails;
import backend.goorm.member.repository.MemberInfoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@Component
@Slf4j
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler{

    @Value("${login.register-url}")
    private String registerUrl;

    @Value("${login.loginSuccess-url}")
    private String loginSuccessUrl;

    private final MemberInfoRepository memberInfoRepository;

    /**
     * OAuth2 Login 이 정상적으로 수행되었으면 해당 핸들러 클래스로 도착하게됨
     * CustomOAuth2UserService 에서 return 한 PrincipalDetail 클래스 ( OAuthUser 객체 ) 가 Sprint Security
     * ContextHolder 에 등록되어 있기 때문에 Authentication 파라미터에서 return 한 객체를 꺼낼 수 있다
     * @param request
     * @param response
     * @param authentication
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        Member member = principalDetails.member();

        log.info("OAuth2 Login 성공 핸들러에 도착했습니다 회원 정보 -> pk : {} , nickname : {}",member.getMemberId(), member.getMemberNickname());

        /***
         * CASE 1. 회원가입이 이미 되어있는 유저 라면 메인페이지로 redirect 해야함
         * redirect 할 때 queryParam 으로 memberId ( PK ) 반환
         */
        if(member.isMemberRegistered()){

            Optional<MemberInfo> memberInfo = memberInfoRepository.findByMemberId(member);

            response.sendRedirect(UriComponentsBuilder
                    .fromUriString(loginSuccessUrl)
                    .queryParam("memberId", member.getMemberId())
                    .queryParam("info", memberInfo.isPresent())
                    .build()
                    .encode(StandardCharsets.UTF_8)
                    .toUriString());
        }
        /**
         * case 2. 회원가입이 진행되어있지 않은 유저라면 회원가입 페이지로 redirect 해야함
         * redirect 할 때 queryParam 으로 memberId, email, nickname 반환 [ email, nickname 은 카카오에서 가져옴 ]
         */
        else{

            response.sendRedirect(UriComponentsBuilder
                    .fromUriString(registerUrl)
                    .queryParam("memberId", member.getMemberId())
                    .queryParam("email", member.getMemberEmail())
                    .queryParam("nickname", member.getMemberNickname())
                    .build()
                    .encode(StandardCharsets.UTF_8)
                    .toUriString());
        }

    }
}
