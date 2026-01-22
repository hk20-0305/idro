package com.india.idro.controller;

import com.india.idro.model.Action;
import com.india.idro.repository.ActionRepository;
import com.india.idro.repository.AlertRepository; // ✅ Import this
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/actions")
@CrossOrigin(origins = "*")
public class ActionController {

    @Autowired
    private ActionRepository actionRepository;

    @Autowired
    private AlertRepository alertRepository; // ✅ ADD THIS MISSING PART

    @GetMapping
    public List<Action> getAllActions() {
        return actionRepository.findAll();
    }

    @PostMapping("/{alertId}")
    public ResponseEntity<Action> createAction(@PathVariable String alertId, @RequestBody Action action) {
        // Now this line will work because alertRepository is defined!
        return alertRepository.findById(alertId).map(alert -> {
            action.setAlertId(alertId);
            action.setTimestamp(LocalDateTime.now());
            return ResponseEntity.ok(actionRepository.save(action));
        }).orElse(ResponseEntity.notFound().build());
    }
}