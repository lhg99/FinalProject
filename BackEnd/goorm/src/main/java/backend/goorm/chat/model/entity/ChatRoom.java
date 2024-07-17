package backend.goorm.chat.model.entity;

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
    private String chatRoomName;

    @ManyToMany(mappedBy = "chatRooms")
    private List<Member> members;

}
