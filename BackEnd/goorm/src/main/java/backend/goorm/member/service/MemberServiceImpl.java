package backend.goorm.member.service;

import backend.goorm.member.model.dto.request.*;
import backend.goorm.member.model.dto.response.DuplicateCheckResponse;
import backend.goorm.member.model.dto.response.MemberInfoResponse;
import backend.goorm.member.model.entity.Member;
import backend.goorm.member.model.entity.MemberInfo;
import backend.goorm.member.model.enums.MemberRole;
import backend.goorm.member.model.enums.MemberType;
import backend.goorm.member.repository.MemberInfoRepository;
import backend.goorm.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.DateFormatter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Slf4j
public class MemberServiceImpl implements  MemberService{

    private final MemberRepository memberRepository;
    private final MemberInfoRepository memberInfoRepository;

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
                .memberType(MemberType.DEFAULT)
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
    public DuplicateCheckResponse duplicateCheck(DuplicateCheckRequest duplicateCheckRequest) {


        Optional<Member> member = null;
        String value = duplicateCheckRequest.getCheckValue();

        switch(duplicateCheckRequest.getCheckType()){

            case LOGIN_ID -> member = memberRepository.findByLoginId(value);
            case EMAIL -> member = memberRepository.findByMemberEmail(value);
            case PHONE -> member = memberRepository.findByMemberPhone(value);
            case NICKNAME -> member = memberRepository.findByMemberNickname(value);

        }

        DuplicateCheckResponse duplicateCheckResponse = new DuplicateCheckResponse();

        if(member.isPresent()){
            // TODO : ADD NEW DUPLICATION EXCEPTION
            duplicateCheckResponse.setMessage("중복된 값입니다");
            duplicateCheckResponse.setUsable(false);
        }else{
            duplicateCheckResponse.setMessage("사용할 수 있는 값입니다");
            duplicateCheckResponse.setUsable(true);
        }

        return duplicateCheckResponse;
    }

    /**
     * 회원 신체정보 등록
     * @param regMemberInfoRequest
     */
    @Override
    public void regMemberInfo(regMemberInfoRequest regMemberInfoRequest, Member member) {

        Optional<MemberInfo> findMemberInfo
                = memberInfoRepository.findByMemberId(member);

        if(findMemberInfo.isPresent()){
            // TODO : 새로운 예외처리 필요
            throw new RuntimeException("이미 회원정보가 등록된 회원입니다");
        }

        MemberInfo memberInfo = MemberInfo.builder()
                .memberId(member)
                .memberHeight(regMemberInfoRequest.getMemberHeight())
                .memberWeight(regMemberInfoRequest.getMemberWeight())
                .comment(regMemberInfoRequest.getComment())
                .build();

        memberInfoRepository.save(memberInfo);
    }

    @Override
    public MemberInfoResponse getMemberInfo(Member member) {

        Optional<MemberInfo> findInfo = memberInfoRepository.findByIdWithMember(member);

        if(!findInfo.isPresent()){
            // TODO : 적절한 예외처리 필요
            throw new RuntimeException("회원정보가 존재하지 않음");
        }

        Member findMember  = findInfo.get().getMemberId();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
        String regDate = findMember.getMemberRegDate().format(formatter);

        return MemberInfoResponse.builder()
                .memberName(findMember.getMemberName())
                .memberEmail(findMember.getMemberEmail())
                .memberNickname(findMember.getMemberNickname())
                .memberPhone(findMember.getMemberPhone())
                .memberRegDate(regDate)
                .memberHeight(findInfo.get().getMemberHeight())
                .memberWeight(findInfo.get().getMemberWeight())
                .comment(findInfo.get().getComment())
                .memberType(findMember.getMemberType())
                .build();
    }

    @Override
    @Transactional
    public void changePw(Member member, ChangePwRequest changePwRequest) {

        Optional<Member> findMember = memberRepository.findByMemberId(member.getMemberId());

        if(!encoder.matches(changePwRequest.getOldPassword(), findMember.get().getLoginPw())){
            // TODO : 적절한 예외상황 던저야함
            throw new RuntimeException("비밀번호가 일치하지 않음");
        }

        findMember.get().setLoginPw(encoder.encode(changePwRequest.getNewPassword()));
    }

    @Override
    @Transactional
    public void changeInfo(Member member, ChangeInfoRequest changeInfoRequest) {
        Optional<MemberInfo> findInfo = memberInfoRepository.findByIdWithMember(member);

        if(findInfo.get().getMemberId().getMemberType() == MemberType.SOCIAL){
            throw new RuntimeException("소셜 회원은 비밀번호 변경을 진행할 수 없습니다");
        }

        Optional<Member> findByNickname = memberRepository.findByMemberNickname(changeInfoRequest.getNickname());

        if(findByNickname.isPresent()){
            // TODO : 적절한 예외처리 필요
            throw new RuntimeException("이미 존재하는 닉네임, 잘못된 요청입니다");
        }

        findInfo.get().setComment(changeInfoRequest.getComment());
        findInfo.get().getMemberId().setMemberNickname(changeInfoRequest.getNickname());

    }

    @Override
    @Transactional
    public void memberWithdrawal(Member member) {
        Optional<Member> findMember = memberRepository.findByMemberId(member.getMemberId());

        if(!findMember.isPresent()){
            // TODO : 적절한 예외처리 필요
            throw new RuntimeException("잘못된 접급");
        }

        findMember.get().setMemberInactive(true);
    }
}
