package backend.goorm.chat.model.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QChatRoom is a Querydsl query type for ChatRoom
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QChatRoom extends EntityPathBase<ChatRoom> {

    private static final long serialVersionUID = -455742519L;

    public static final QChatRoom chatRoom = new QChatRoom("chatRoom");

    public final NumberPath<Long> chatRoomId = createNumber("chatRoomId", Long.class);

    public final StringPath chatRoomName = createString("chatRoomName");

    public final EnumPath<backend.goorm.chat.model.entity.enums.ChatRoomStatus> chatRoomStatus = createEnum("chatRoomStatus", backend.goorm.chat.model.entity.enums.ChatRoomStatus.class);

    public final EnumPath<backend.goorm.chat.model.entity.enums.ChatRoomType> chatRoomType = createEnum("chatRoomType", backend.goorm.chat.model.entity.enums.ChatRoomType.class);

    public final ListPath<Chat, QChat> chats = this.<Chat, QChat>createList("chats", Chat.class, QChat.class, PathInits.DIRECT2);

    public final ListPath<backend.goorm.member.model.entity.Member, backend.goorm.member.model.entity.QMember> members = this.<backend.goorm.member.model.entity.Member, backend.goorm.member.model.entity.QMember>createList("members", backend.goorm.member.model.entity.Member.class, backend.goorm.member.model.entity.QMember.class, PathInits.DIRECT2);

    public QChatRoom(String variable) {
        super(ChatRoom.class, forVariable(variable));
    }

    public QChatRoom(Path<? extends ChatRoom> path) {
        super(path.getType(), path.getMetadata());
    }

    public QChatRoom(PathMetadata metadata) {
        super(ChatRoom.class, metadata);
    }

}

