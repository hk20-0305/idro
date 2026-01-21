package com.india.idro.repository;

import com.india.idro.model.CoordinationMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CoordinationMessageRepository extends MongoRepository<CoordinationMessage, String> {

    // Find messages by user
    List<CoordinationMessage> findByUser(String user);

    // Find messages by type ("normal" or "warning")
    List<CoordinationMessage> findByType(String type);

    // Find warning messages only
    List<CoordinationMessage> findByTypeOrderByCreatedAtDesc(String type);

    // Find all messages ordered by creation date (newest first)
    List<CoordinationMessage> findAllByOrderByCreatedAtDesc();

    // Find messages created after specific date
    List<CoordinationMessage> findByCreatedAtAfter(LocalDateTime dateTime);

    // Find messages containing keyword in message content
    List<CoordinationMessage> findByMessageContainingIgnoreCase(String keyword);

    // Get recent messages (last 50)
    default List<CoordinationMessage> findRecentMessages() {
        return findAllByOrderByCreatedAtDesc().stream()
                .limit(50)
                .toList();
    }

    // Get warning messages only
    default List<CoordinationMessage> findWarningMessages() {
        return findByType("warning");
    }
}