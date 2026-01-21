package com.india.idro.service;

import com.india.idro.dto.AlertColor;
import com.india.idro.model.Alert;
import com.india.idro.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private AlertRepository alertRepository;

    public Map<String, Object> getDashboardStats() {
        List<Alert> allAlerts = alertRepository.findAll();
        
        Map<String, Object> stats = new HashMap<>();
        
        // Count Totals
        stats.put("totalAlerts", allAlerts.size());
        
        // ✅ Fix 1: Use getMissionStatus() instead of getStatus()
        // ✅ Fix 2: Compare Strings properly
        long activeCount = allAlerts.stream()
                .filter(a -> "OPEN".equals(a.getMissionStatus())) 
                .count();
        stats.put("activeAlerts", activeCount);

        // Count High Priority (Red)
        // ✅ Fix 3: Compare String field with Enum.name()
        long criticalCount = allAlerts.stream()
                .filter(a -> a.getColor() != null && a.getColor().equals(AlertColor.RED.name()))
                .count();
        stats.put("criticalAlerts", criticalCount);

        return stats;
    }
    
    // AI Prediction Logic (Mock)
    public String predictNextThreat() {
        List<Alert> alerts = alertRepository.findAll();
        
        // ✅ Fix 4: Compare String field with Enum.name()
        long floodCount = alerts.stream()
                .filter(a -> a.getColor() != null && a.getColor().equals(AlertColor.RED.name()) && "FLOOD".equals(a.getType()))
                .count();

        if (floodCount > 2) {
            return "HIGH PROBABILITY: Heavy Rainfall expected in Coastal Areas";
        }
        return "STABLE: No immediate anomalies detected.";
    }
}