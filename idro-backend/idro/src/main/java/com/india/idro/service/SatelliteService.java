package com.india.idro.service;

import com.india.idro.dto.AlertColor;
import com.india.idro.dto.AlertType;
import com.india.idro.model.Alert;
import com.india.idro.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Service
public class SatelliteService {

    @Autowired
    private AlertRepository alertRepository;

    // Simulate Satellite Scan every 60 seconds
    @Scheduled(fixedRate = 60000)
    public void scanSatelliteData() {
        Random rand = new Random();
        
        // 10% Chance to detect a new threat via "Satellite"
        if (rand.nextInt(10) > 8) {
            Alert newAlert = new Alert();
            
            // ✅ Fix 1: Convert Enum to String
            newAlert.setType(AlertType.FIRE.name()); 
            
            newAlert.setLocation("Detected by SAT-2A (Forest Zone)");
            newAlert.setDetails("Thermal anomaly detected. Possible wildfire.");
            newAlert.setMagnitude("High");
            newAlert.setImpact("Critical");
            
            // ✅ Fix 2: Convert Enum to String
            newAlert.setColor(AlertColor.RED.name()); 
            
            // Random Coordinates near India
            newAlert.setLatitude(20.0 + (rand.nextDouble() * 5)); 
            newAlert.setLongitude(78.0 + (rand.nextDouble() * 5));
            
            // ✅ Fix 3: Use setMissionStatus() instead of setStatus()
            newAlert.setMissionStatus("OPEN"); 

            // ✅ Fix 4: Convert LocalDateTime to String
            newAlert.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
            
            // Set Trust Scores for System Data
            newAlert.setTrustScore(98);
            newAlert.setReporterLevel("SYSTEM");
            newAlert.setSourceType("SATELLITE");

            alertRepository.save(newAlert);
            System.out.println("🛰️ SATELLITE ALERT GENERATED: " + newAlert.getLocation());
        }
    }
}