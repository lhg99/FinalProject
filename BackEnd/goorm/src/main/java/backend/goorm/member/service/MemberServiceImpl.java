package backend.goorm.member.service;

import backend.goorm.common.exception.CustomException;
import backend.goorm.common.exception.CustomExceptionType;
import backend.goorm.common.util.DateConvertUtil;
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

import java.time.LocalDateTime;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Slf4j
public class MemberServiceImpl implements  MemberService{

    private final MemberRepository memberRepository;
    private final MemberInfoRepository memberInfoRepository;

    private final BCryptPasswordEncoder encoder;
    private final DateConvertUtil dateConvertUtil;


    /**
     * 일반 회원 회원가입 처리 로직
     * @param signupRequest
     */
    @Override
    public void signup(SignupRequest signupRequest) {

        Optional<Member> duplicate = memberRepository
                .findDuplicate(signupRequest.getLoginId(), signupRequest.getEmail(), signupRequest.getUsername());

        if (duplicate.isPresent()) {
            throw new CustomException(CustomExceptionType.DUPLICATE_INFORMATION);
        }

        Member saveMember = Member.builder()
                .loginId(signupRequest.getLoginId())
                .loginPw(encoder.encode(signupRequest.getLoginPw()))
                .memberName(signupRequest.getName())
                .memberEmail(signupRequest.getEmail())
                .memberNickname(signupRequest.getUsername())
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
            throw new CustomException(CustomExceptionType.RUNTIME_EXCEPTION);
        }

        Member member = findUser.get();
        member.setMemberName(oauthSignupRequest.getMemberName());
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
            case NICKNAME -> member = memberRepository.findByMemberNickname(value);

        }

        DuplicateCheckResponse duplicateCheckResponse = new DuplicateCheckResponse();

        if(member.isPresent()){
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
            throw new CustomException(CustomExceptionType.ALREADY_REG_INFO);
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
            return MemberInfoResponse.builder()
                    .memberName(member.getMemberName())
                    .memberEmail(member.getMemberEmail())
                    .username(member.getMemberNickname())
                    .memberRegDate(dateConvertUtil.convertDateToString(member.getMemberRegDate()))
                    .memberHeight(null)
                    .memberWeight(null)
                    .comment(null)
                    .memberType(member.getMemberType())
                    .build();
        }else{
            return MemberInfoResponse.builder()
                    .memberName(member.getMemberName())
                    .memberEmail(member.getMemberEmail())
                    .username(member.getMemberNickname())
                    .memberRegDate(dateConvertUtil.convertDateToString(member.getMemberRegDate()))
                    .memberHeight(findInfo.get().getMemberHeight())
                    .memberWeight(findInfo.get().getMemberWeight())
                    .comment(findInfo.get().getComment())
                    .memberType(member.getMemberType())
                    .build();
        }

    }

    @Override
    @Transactional
    public void changePw(Member member, ChangePwRequest changePwRequest) {

        Optional<Member> findMember = memberRepository.findByMemberId(member.getMemberId());

        if(!encoder.matches(changePwRequest.getOldPassword(), findMember.get().getLoginPw())){
            throw new CustomException(CustomExceptionType.PASSWORD_MISMATCH);
        }

        findMember.get().setLoginPw(encoder.encode(changePwRequest.getNewPassword()));
    }

    @Override
    @Transactional
    public void changeInfo(Member member, ChangeInfoRequest changeInfoRequest) {
        Optional<MemberInfo> findInfo = memberInfoRepository.findByIdWithMember(member);

        if(findInfo.get().getMemberId().getMemberType() == MemberType.SOCIAL){
            // 소셜 회원은 비밀번호 변경을 할 수 없음
            throw new CustomException(CustomExceptionType.RUNTIME_EXCEPTION);
        }

        Optional<Member> findByNickname = memberRepository.findByMemberNickname(changeInfoRequest.getUsername());

        if(findByNickname.isPresent()){
            throw new CustomException(CustomExceptionType.DUPLICATE_INFORMATION);
        }

        findInfo.get().setComment(changeInfoRequest.getComment());
        findInfo.get().getMemberId().setMemberNickname(changeInfoRequest.getUsername());

    }

    @Override
    @Transactional
    public void memberWithdrawal(Member member) {
        Optional<Member> findMember = memberRepository.findByMemberId(member.getMemberId());

        if(!findMember.isPresent()) {
            throw new CustomException(CustomExceptionType.RUNTIME_EXCEPTION);
        }

        findMember.get().setMemberInactive(true);
    }
}
