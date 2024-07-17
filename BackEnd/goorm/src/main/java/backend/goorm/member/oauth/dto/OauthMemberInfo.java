package backend.goorm.member.oauth.dto;

import java.util.Map;

public abstract class OauthMemberInfo {
    protected Map<String, Object> attributes;

    public OauthMemberInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    public abstract String getProviderId();

    public abstract String getEmail();

    public abstract String getNickname();

    public abstract String getProfile();
}
