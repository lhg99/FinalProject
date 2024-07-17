package backend.goorm.member.service;

import backend.goorm.member.model.dto.request.DuplicateCheckRequest;
import backend.goorm.member.model.dto.request.OauthSignupRequest;
import backend.goorm.member.model.dto.request.SignupRequest;
import backend.goorm.member.model.entity.Member;
import backend.goorm.member.model.enums.MemberRole;
import backend.goorm.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Slf4j
public class MemberServiceImpl implements  MemberService{

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder encoder;


    /**
     * 일반 회원 회원가입 처리 로직
     * @param signupRequest
     */
    @Override
    public void signup(SignupRequest signupRequest) {

        Optional<Member> duplicate = memberRepository
                .findDuplicate(signupRequest.getLoginId(), signupRequest.getEmail(), signupRequest.getNickname());

        if (duplicate.isPresent()) {
            // TODO: ADD DUPLICATE EXCEPTION
            throw new RuntimeException("중복된 사용자가 존재");
        }

        Member saveMember = Member.builder()
                .loginId(signupRequest.getLoginId())
                .loginPw(encoder.encode(signupRequest.getLoginPw()))
                .memberName(signupRequest.getName())
                .memberEmail(signupRequest.getEmail())
                .memberNickname(signupRequest.getNickname())
                .memberPhone(signupRequest.getPhone())
                .role(MemberRole.MEMBER)
                .memberRegDate(LocalDateTime.now())
                .memberInactive(false)
                .memberRegistered(true)
                .build();

        memberRepository.save(saveMember);
    }

    /**
     * 소셜 로그인 회원 회원가입 처리 로직
     * @param oauthSignupRequest
     */
    @Override
    @Transactional
    public void oauthSignup(OauthSignupRequest oauthSignupRequest) {

        Optional<Member> findUser = memberRepository.findByMemberId(oauthSignupRequest.getMemberId());

        if (!findUser.isPresent()) {
            throw new RuntimeException("잘못된 요청");
        }

        Member member = findUser.get();
        member.setMemberName(oauthSignupRequest.getMemberName());
        member.setMemberPhone(oauthSignupRequest.getMemberPhone());
        member.setMemberRegistered(true);
        member.setMemberRegDate(LocalDateTime.now());

    }

    /**
     * 중복 아이디, 닉네임, 전화번호, 이메일 등이 있는 지 확인
     * @param duplicateCheckRequest
     */
    @Override
    public void duplicateCheck(DuplicateCheckRequest duplicateCheckRequest) {


        Optional<Member> member = null;
        String value = duplicateCheckRequest.getCheckValue();

        switch(duplicateCheckRequest.getCheckType()){

            case LOGIN_ID -> member = memberRepository.findByLoginId(value);
            case EMAIL -> member = memberRepository.findByMemberEmail(value);
            case PHONE -> member = memberRepository.findByMemberPhone(value);
            case NICKNAME -> member = memberRepository.findByMemberNickname(value);

        }

        if(member.isPresent()){
            // TODO : ADD NEW DUPLICATION EXCEPTION
            throw new RuntimeException("이미 사용하고 있는 값입니다");
        }

    }
}
