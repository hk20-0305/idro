package com.india.idro.repository;

import com.india.idro.model.Action;
import com.india.idro.model.enums.UserRole;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActionRepository extends MongoRepository<Action, String> {

    // Find actions by role (GOV, NGO, VOLUNTEER)
    List<Action> findByRole(UserRole role);

    // Find actions by target zone
    List<Action> findByTargetZone(String targetZone);

    // Find actions by target zone containing keyword
    List<Action> findByTargetZoneContainingIgnoreCase(String keyword);

    // Find high priority actions
    List<Action> findByPriorityTrue();

    // Find actions by role and priority
    List<Action> findByRoleAndPriority(UserRole role, Boolean priority);

    // Find all actions ordered by timestamp (newest first)
    List<Action> findAllByOrderByTimestampDesc();

    // Find actions created after a specific date
    List<Action> findByTimestampAfter(LocalDateTime timestamp);

    // Find actions by user ID (for future use when auth is implemented)
    List<Action> findByUserId(String userId);

    // Find recent high priority actions (last 24 hours)
    default List<Action> findRecentPriorityActions() {
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        return findByTimestampAfter(yesterday).stream()
                .filter(Action::getPriority)
                .toList();
    }
}