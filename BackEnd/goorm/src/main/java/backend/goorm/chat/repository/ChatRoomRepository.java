package backend.goorm.chat.repository;

import backend.goorm.chat.model.entity.ChatRoom;
import backend.goorm.member.model.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
}
