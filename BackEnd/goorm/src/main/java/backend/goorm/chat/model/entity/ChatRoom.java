package backend.goorm.chat.model.entity;

import backend.goorm.chat.model.entity.enums.ChatRoomStatus;
import backend.goorm.chat.model.entity.enums.ChatRoomType;
import backend.goorm.member.model.entity.Member;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_room_id")
    private Long chatRoomId;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Chat> chats;

    private String chatRoomName;

    @Enumerated(EnumType.STRING)
    private ChatRoomType chatRoomType;

    @Enumerated(EnumType.STRING)
    private ChatRoomStatus chatRoomStatus;

    @ManyToMany(mappedBy = "chatRooms")
    private List<Member> members;

}
