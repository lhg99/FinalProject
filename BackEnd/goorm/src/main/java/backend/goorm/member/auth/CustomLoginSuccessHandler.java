package backend.goorm.member.auth;

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
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
@Slf4j
@RequiredArgsConstructor
public class CustomLoginSuccessHandler implements AuthenticationSuccessHandler {

    private final ObjectMapper objectMapper;
    private final MemberInfoRepository memberInfoRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        Member member = principalDetails.member();

        Optional<MemberInfo> memberInfo = memberInfoRepository.findByMemberId(member);

        response.setStatus(HttpServletResponse.SC_OK);
        Map<String, String> result = new HashMap<>();
        result.put("message", "로그인이 정상적으로 완료되었습니다");
        result.put("userId", String.valueOf(member.getMemberId()));
        result.put("info", String.valueOf(memberInfo.isPresent()));

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(result));
    }
}
