package backend.goorm.member.service;

import backend.goorm.member.model.dto.request.*;
import backend.goorm.member.model.dto.response.DuplicateCheckResponse;
import backend.goorm.member.model.dto.response.MemberInfoResponse;
import backend.goorm.member.model.entity.Member;

public interface MemberService {
    void signup(SignupRequest signupRequest);

    void oauthSignup(OauthSignupRequest oauthSignupRequest);

    DuplicateCheckResponse duplicateCheck(DuplicateCheckRequest duplicateCheckRequest);

    void regMemberInfo(regMemberInfoRequest regMemberInfoRequest, Member member);

    MemberInfoResponse getMemberInfo(Member member);

    void changePw(Member member, ChangePwRequest changePwRequest);

    void changeInfo(Member member, ChangeInfoRequest changeInfoRequest);

    void memberWithdrawal(Member member);
}
