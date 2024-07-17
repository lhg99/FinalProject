package backend.goorm.member.service;

import backend.goorm.member.model.dto.request.DuplicateCheckRequest;
import backend.goorm.member.model.dto.request.OauthSignupRequest;
import backend.goorm.member.model.dto.request.SignupRequest;

public interface MemberService {
    void signup(SignupRequest signupRequest);

    void oauthSignup(OauthSignupRequest oauthSignupRequest);

    void duplicateCheck(DuplicateCheckRequest duplicateCheckRequest);
}
