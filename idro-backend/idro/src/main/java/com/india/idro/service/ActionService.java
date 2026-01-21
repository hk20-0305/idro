package com.india.idro.service;

import com.india.idro.model.Action;
import com.india.idro.model.enums.UserRole;
import com.india.idro.repository.ActionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ActionService {

    private final ActionRepository actionRepository;

    // Create new action (Deploy resources)
    public Action createAction(Action action) {
        return actionRepository.save(action);
    }

    // Get all actions (history)
    public List<Action> getAllActions() {
        return actionRepository.findAllByOrderByTimestampDesc();
    }

    // Get action by ID
    public Optional<Action> getActionById(String id) {
        return actionRepository.findById(id);
    }

    // Get actions by role (GOV, NGO, VOLUNTEER)
    public List<Action> getActionsByRole(UserRole role) {
        return actionRepository.findByRole(role);
    }

    // Get actions by target zone
    public List<Action> getActionsByTargetZone(String targetZone) {
        return actionRepository.findByTargetZone(targetZone);
    }

    // Search actions by target zone keyword
    public List<Action> searchActionsByZone(String keyword) {
        return actionRepository.findByTargetZoneContainingIgnoreCase(keyword);
    }

    // Get high priority actions only
    public List<Action> getPriorityActions() {
        return actionRepository.findByPriorityTrue();
    }

    // Get recent priority actions (last 24 hours)
    public List<Action> getRecentPriorityActions() {
        return actionRepository.findRecentPriorityActions();
    }

    // Get actions by role and priority
    public List<Action> getActionsByRoleAndPriority(UserRole role, Boolean priority) {
        return actionRepository.findByRoleAndPriority(role, priority);
    }

    // Get actions created after specific date
    public List<Action> getActionsAfterDate(LocalDateTime dateTime) {
        return actionRepository.findByTimestampAfter(dateTime);
    }

    // Get actions by user ID (for future auth)
    public List<Action> getActionsByUserId(String userId) {
        return actionRepository.findByUserId(userId);
    }

    // Update action
    public Action updateAction(String id, Action updatedAction) {
        return actionRepository.findById(id)
                .map(existingAction -> {
                    existingAction.setRole(updatedAction.getRole());
                    existingAction.setTargetZone(updatedAction.getTargetZone());
                    existingAction.setResourceType(updatedAction.getResourceType());
                    existingAction.setQuantity(updatedAction.getQuantity());
                    existingAction.setPriority(updatedAction.getPriority());
                    return actionRepository.save(existingAction);
                })
                .orElseThrow(() -> new RuntimeException("Action not found with id: " + id));
    }

    // Delete action
    public void deleteAction(String id) {
        actionRepository.deleteById(id);
    }

    // Get total action count
    public long getActionCount() {
        return actionRepository.count();
    }

    // Get action count by role
    public long getActionCountByRole(UserRole role) {
        return actionRepository.findByRole(role).size();
    }
}