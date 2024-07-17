package backend.goorm.member.controller;

import backend.goorm.member.model.dto.request.DuplicateCheckRequest;
import backend.goorm.member.service.MemberServiceImpl;
import backend.goorm.member.model.dto.request.OauthSignupRequest;
import backend.goorm.member.model.dto.request.SignupRequest;
import backend.goorm.member.model.entity.Member;
import backend.goorm.member.oauth.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {

    private final MemberServiceImpl memberService;

    /**
     * 일반 회원이 회원가입 요청을 하는 API
     * @param signupRequest
     * @return
     */
    @PostMapping("/signup")
    public ResponseEntity signup(@RequestBody SignupRequest signupRequest){

        memberService.signup(signupRequest);

        return ResponseEntity.ok("회원가입 성공");
    }

    /**
     * 소셜 가입 유저가 회원가입을 위한 API
     * @param oauthSignupRequest
     * @return
     */
    @PostMapping("/oauth/signup")
    public ResponseEntity oauthSignup(@RequestBody OauthSignupRequest oauthSignupRequest){

        memberService.oauthSignup(oauthSignupRequest);

        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("duplicate/check")
    public ResponseEntity duplicateCheck(@RequestBody DuplicateCheckRequest duplicateCheckRequest){

        memberService.duplicateCheck(duplicateCheckRequest);

        return ResponseEntity.ok("사용 가능합니다");
    }

    /**
     * 테스트 API
     * @param authentication
     * @return
     */
    @GetMapping("/testOAuth")
    public String test(Authentication authentication){
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        // member 에서 정보 뺴가시면 됩니다
        Member member = principalDetails.member();
        log.info(principalDetails.member().getMemberName());

        return member.getMemberName();
    }

}
