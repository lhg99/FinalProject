package backend.goorm.member.oauth.dto;

import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;

import java.util.Map;

public class OAuth2UserInfoFactory{

    public static OauthUserInfo getOAuth2UserInfo(OAuth2UserRequest userRequest, Map<String, Object> attributes) {
        System.out.println("is google " + userRequest.getClientRegistration().getClientName());

        if (userRequest.getClientRegistration().getClientName().equalsIgnoreCase("KAKAO")) {
            return new KakaoUserInfo(attributes);
        } else {
            //TODO: ADD CUSTOM EXCEPTION
            throw new RuntimeException("Unsupported client type: " + userRequest.getClientRegistration().getClientName());
        }
    }
}