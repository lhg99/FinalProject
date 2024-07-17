package backend.goorm.chat.repository;

import backend.goorm.chat.model.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByChatRoomId(Long chatRoomId);
}
