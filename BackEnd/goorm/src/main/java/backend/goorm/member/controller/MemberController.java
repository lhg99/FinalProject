package backend.goorm.member.controller;

import backend.goorm.member.model.dto.request.*;
import backend.goorm.member.model.dto.response.DuplicateCheckResponse;
import backend.goorm.member.model.dto.response.MemberInfoResponse;
import backend.goorm.member.repository.MemberRepository;
import backend.goorm.member.service.MemberService;
import backend.goorm.member.model.entity.Member;
import backend.goorm.member.oauth.PrincipalDetails;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;
    private final MemberRepository memberRepository;

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

    /**
     * 중복체크를 위한 API
     * @param duplicateCheckRequest
     * @return
     */
    @PostMapping("/duplicate/check")
    public ResponseEntity duplicateCheck(@RequestBody DuplicateCheckRequest duplicateCheckRequest){

        DuplicateCheckResponse duplicateCheckResponse = memberService.duplicateCheck(duplicateCheckRequest);

        return ResponseEntity.ok(duplicateCheckResponse);
    }

    @PostMapping("/reg/info")
    public ResponseEntity regMemberInfo(@RequestBody regMemberInfoRequest regMemberInfoRequest, Authentication authentication){

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        memberService.regMemberInfo(regMemberInfoRequest, principalDetails.member());

        return ResponseEntity.ok("등록 완료");
    }

    @GetMapping("/get/info")
    public ResponseEntity getMemberInfo(Authentication authentication){

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        MemberInfoResponse memberInfoResponse = memberService.getMemberInfo(principalDetails.member());

        return ResponseEntity.ok(memberInfoResponse);
    }

    /**
     * 비밀 번호 변경 API
     * @param changePwRequest
     * @param authentication
     * @return
     */
    @PostMapping("/change/pw")
    public ResponseEntity changePassWord(@RequestBody ChangePwRequest changePwRequest, Authentication authentication){

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        memberService.changePw(principalDetails.member(), changePwRequest);

        return ResponseEntity.ok("변경 완료");
    }

    @PostMapping("/change/info")
    public ResponseEntity changeInfo(@RequestBody ChangeInfoRequest changeInfoRequest, Authentication authentication){

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        memberService.changeInfo(principalDetails.member(), changeInfoRequest);

        return ResponseEntity.ok("변경 완료");
    }

    @PostMapping("/withdrawal")
    public ResponseEntity memberWithdrawal(Authentication authentication, HttpServletResponse response) throws IOException {

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        memberService.memberWithdrawal(principalDetails.member());

        /**
         * 추후 프론트랑 해봐야함
         * 1. 프론트에서 logout 재요청
         * 2. redirect 여기서 문제없이 되면 그냥 진행s
         */
        response.sendRedirect("/api/auth/logout");

        return ResponseEntity.ok("회원탈퇴 완료");
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
        Optional<Member> byMemberId = memberRepository.findByMemberId(member.getMemberId());

        return byMemberId.get().getMemberNickname();
    }

}
