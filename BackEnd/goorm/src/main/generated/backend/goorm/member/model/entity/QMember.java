package backend.goorm.member.model.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QMember is a Querydsl query type for Member
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMember extends EntityPathBase<Member> {

    private static final long serialVersionUID = 1838553170L;

    public static final QMember member = new QMember("member1");

    public final ListPath<backend.goorm.chat.model.entity.ChatRoom, backend.goorm.chat.model.entity.QChatRoom> chatRooms = this.<backend.goorm.chat.model.entity.ChatRoom, backend.goorm.chat.model.entity.QChatRoom>createList("chatRooms", backend.goorm.chat.model.entity.ChatRoom.class, backend.goorm.chat.model.entity.QChatRoom.class, PathInits.DIRECT2);

    public final StringPath loginId = createString("loginId");

    public final StringPath loginPw = createString("loginPw");

    public final StringPath memberEmail = createString("memberEmail");

    public final NumberPath<Long> memberId = createNumber("memberId", Long.class);

    public final BooleanPath memberInactive = createBoolean("memberInactive");

    public final StringPath memberName = createString("memberName");

    public final StringPath memberNickname = createString("memberNickname");

    public final DateTimePath<java.time.LocalDateTime> memberRegDate = createDateTime("memberRegDate", java.time.LocalDateTime.class);

    public final BooleanPath memberRegistered = createBoolean("memberRegistered");

    public final EnumPath<backend.goorm.member.model.enums.MemberType> memberType = createEnum("memberType", backend.goorm.member.model.enums.MemberType.class);

    public final EnumPath<backend.goorm.member.model.enums.MemberRole> role = createEnum("role", backend.goorm.member.model.enums.MemberRole.class);

    public final StringPath socialId = createString("socialId");

    public QMember(String variable) {
        super(Member.class, forVariable(variable));
    }

    public QMember(Path<? extends Member> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMember(PathMetadata metadata) {
        super(Member.class, metadata);
    }

}

