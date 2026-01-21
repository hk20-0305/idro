package com.india.idro.controller;

import com.india.idro.model.CoordinationMessage;
import com.india.idro.service.CoordinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coordination")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CoordinationController {

    private final CoordinationService coordinationService;

    // GET /api/coordination/messages - Get all messages
    @GetMapping("/messages")
    public ResponseEntity<List<CoordinationMessage>> getAllMessages() {
        List<CoordinationMessage> messages = coordinationService.getAllMessages();
        return ResponseEntity.ok(messages);
    }

    // GET /api/coordination/messages/recent - Get recent messages (last 50)
    @GetMapping("/messages/recent")
    public ResponseEntity<List<CoordinationMessage>> getRecentMessages() {
        List<CoordinationMessage> messages = coordinationService.getRecentMessages();
        return ResponseEntity.ok(messages);
    }

    // GET /api/coordination/messages/{id} - Get message by ID
    @GetMapping("/messages/{id}")
    public ResponseEntity<CoordinationMessage> getMessageById(@PathVariable String id) {
        return coordinationService.getMessageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/coordination/messages/user/{user} - Get messages by user
    @GetMapping("/messages/user/{user}")
    public ResponseEntity<List<CoordinationMessage>> getMessagesByUser(@PathVariable String user) {
        List<CoordinationMessage> messages = coordinationService.getMessagesByUser(user);
        return ResponseEntity.ok(messages);
    }

    // GET /api/coordination/messages/type/{type} - Get messages by type
    @GetMapping("/messages/type/{type}")
    public ResponseEntity<List<CoordinationMessage>> getMessagesByType(@PathVariable String type) {
        List<CoordinationMessage> messages = coordinationService.getMessagesByType(type);
        return ResponseEntity.ok(messages);
    }

    // GET /api/coordination/messages/warnings - Get warning messages only
    @GetMapping("/messages/warnings")
    public ResponseEntity<List<CoordinationMessage>> getWarningMessages() {
        List<CoordinationMessage> messages = coordinationService.getWarningMessages();
        return ResponseEntity.ok(messages);
    }

    // GET /api/coordination/messages/search?keyword=ndrf - Search messages
    @GetMapping("/messages/search")
    public ResponseEntity<List<CoordinationMessage>> searchMessages(@RequestParam String keyword) {
        List<CoordinationMessage> messages = coordinationService.searchMessages(keyword);
        return ResponseEntity.ok(messages);
    }

    // POST /api/coordination/messages - Create new message
    @PostMapping("/messages")
    public ResponseEntity<CoordinationMessage> createMessage(@RequestBody CoordinationMessage message) {
        CoordinationMessage createdMessage = coordinationService.createMessage(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMessage);
    }

    // DELETE /api/coordination/messages/{id} - Delete message
    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable String id) {
        coordinationService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/coordination/messages/count - Get total message count
    @GetMapping("/messages/count")
    public ResponseEntity<Long> getMessageCount() {
        long count = coordinationService.getMessageCount();
        return ResponseEntity.ok(count);
    }

    // GET /api/coordination/messages/count/warnings - Get warning count
    @GetMapping("/messages/count/warnings")
    public ResponseEntity<Long> getWarningCount() {
        long count = coordinationService.getWarningMessageCount();
        return ResponseEntity.ok(count);
    }
}