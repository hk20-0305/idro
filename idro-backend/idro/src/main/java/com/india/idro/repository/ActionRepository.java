package com.india.idro.repository;

import com.india.idro.model.Action;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActionRepository extends MongoRepository<Action, String> {

    // ✅ FIXED: Changed UserRole to String to match Model
    List<Action> findByRole(String role);

    // Find actions by target zone
    List<Action> findByTargetZone(String targetZone);

    // Find actions by target zone containing keyword
    List<Action> findByTargetZoneContainingIgnoreCase(String keyword);

    // ✅ FIXED: Changed 'True' to 'Priority' (String match)
    // Now you can call findByPriority("HIGH")
    List<Action> findByPriority(String priority);

    // ✅ FIXED: Changed inputs to String to match Model
    List<Action> findByRoleAndPriority(String role, String priority);

    // Find all actions ordered by timestamp (newest first)
    List<Action> findAllByOrderByTimestampDesc();

    // Find actions created after a specific date
    List<Action> findByTimestampAfter(LocalDateTime timestamp);

    // ✅ FIXED: This now works because we added 'userId' to Action.java
    List<Action> findByUserId(String userId);

    // Find actions linked to a specific Alert (Essential for your app)
    List<Action> findByAlertId(String alertId);

    // ✅ FIXED: Updated logic to check for "HIGH" string instead of boolean
    default List<Action> findRecentPriorityActions() {
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        return findByTimestampAfter(yesterday).stream()
                .filter(a -> "HIGH".equalsIgnoreCase(a.getPriority())) // Checks for "HIGH" text
                .toList();
    }
}