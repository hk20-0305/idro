package com.india.idro.controller;

import com.india.idro.model.Alert;
import com.india.idro.repository.AlertRepository; // ✅ Import this
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*") // Allow frontend to access
public class AlertController {

    // ✅ FIX: Inject the Repository
    @Autowired
    private AlertRepository alertRepository;

    // 1. Get All Alerts
    @GetMapping
    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    // 2. Create New Alert (Volunteer/Satellite)
    @PostMapping
    public Alert createAlert(@RequestBody Alert alert) {
        // Set default status if missing
        if (alert.getMissionStatus() == null) {
            alert.setMissionStatus("OPEN");
        }
        return alertRepository.save(alert);
    }

    // 3. Delete Alert
    @DeleteMapping("/{id}")
    public void deleteAlert(@PathVariable String id) {
        alertRepository.deleteById(id);
    }

    // ✅ 4. NEW: Assign Mission (Locks the task for an NGO)
    @PutMapping("/{id}/assign")
    public Alert assignMission(@PathVariable String id, @RequestParam String responderName) {
        return alertRepository.findById(id).map(alert -> {
            // CRITICAL: Prevent Duplication
            if (!"OPEN".equals(alert.getMissionStatus()) && alert.getMissionStatus() != null) {
                throw new RuntimeException("Mission already taken by " + alert.getResponderName());
            }
            
            alert.setMissionStatus("ASSIGNED");
            alert.setResponderName(responderName);
            return alertRepository.save(alert);
        }).orElseThrow(() -> new RuntimeException("Alert not found"));
    }
}