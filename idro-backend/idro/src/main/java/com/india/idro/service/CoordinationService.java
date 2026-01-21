package com.india.idro.service;

import com.india.idro.model.CoordinationMessage;
import com.india.idro.repository.CoordinationMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CoordinationService {

    private final CoordinationMessageRepository messageRepository;

    // Create new message
    public CoordinationMessage createMessage(CoordinationMessage message) {
        // Auto-generate time if not provided
        if (message.getTime() == null || message.getTime().isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");
            message.setTime(LocalDateTime.now().format(formatter));
        }

        // Set default type if not provided
        if (message.getType() == null || message.getType().isEmpty()) {
            message.setType("normal");
        }

        return messageRepository.save(message);
    }

    // Get all messages
    public List<CoordinationMessage> getAllMessages() {
        return messageRepository.findAllByOrderByCreatedAtDesc();
    }

    // Get recent messages (last 50)
    public List<CoordinationMessage> getRecentMessages() {
        return messageRepository.findRecentMessages();
    }

    // Get message by ID
    public Optional<CoordinationMessage> getMessageById(String id) {
        return messageRepository.findById(id);
    }

    // Get messages by user
    public List<CoordinationMessage> getMessagesByUser(String user) {
        return messageRepository.findByUser(user);
    }

    // Get messages by type
    public List<CoordinationMessage> getMessagesByType(String type) {
        return messageRepository.findByTypeOrderByCreatedAtDesc(type);
    }

    // Get warning messages only
    public List<CoordinationMessage> getWarningMessages() {
        return messageRepository.findWarningMessages();
    }

    // Search messages by keyword
    public List<CoordinationMessage> searchMessages(String keyword) {
        return messageRepository.findByMessageContainingIgnoreCase(keyword);
    }

    // Get messages after specific date
    public List<CoordinationMessage> getMessagesAfterDate(LocalDateTime dateTime) {
        return messageRepository.findByCreatedAtAfter(dateTime);
    }

    // Delete message
    public void deleteMessage(String id) {
        messageRepository.deleteById(id);
    }

    // Get total message count
    public long getMessageCount() {
        return messageRepository.count();
    }

    // Get warning message count
    public long getWarningMessageCount() {
        return messageRepository.findWarningMessages().size();
    }
}