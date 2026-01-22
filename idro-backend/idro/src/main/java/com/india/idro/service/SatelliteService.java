package com.india.idro.service;

import com.india.idro.model.Alert;
import com.india.idro.model.enums.AlertColor;
import com.india.idro.model.enums.AlertType;
import com.india.idro.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct; // Important for auto-run
import java.time.LocalDateTime;
import java.util.Arrays;

@Service
public class SatelliteService {

    @Autowired
    private AlertRepository alertRepository;

    // This makes it run AUTOMATICALLY when server starts
    @PostConstruct 
    public void generateMockData() {
        // 1. WIPE EVERYTHING CLEAN
        alertRepository.deleteAll(); 
        System.out.println("🧹 Database Wiped Clean.");

        // 2. Add The 4 Real Scenarios
        
        // Cyclone (Odisha)
        Alert cyclone = new Alert();
        cyclone.setType(AlertType.CYCLONE);
        cyclone.setColor(AlertColor.RED);
        cyclone.setLocation("Puri, Odisha");
        cyclone.setLatitude(19.8135);
        cyclone.setLongitude(85.8312);
        cyclone.setMagnitude("Severe Cyclonic Storm");
        cyclone.setImpact("Wind 180km/h");
        cyclone.setDetails("IMD Warning: Landfall imminent.");
        cyclone.setTime("LIVE NOW");
        cyclone.setMissionStatus("OPEN");
        cyclone.setTrustScore(99);
        cyclone.setReporterLevel("SATELLITE");
        cyclone.setSourceType("INSAT-3D");
        cyclone.setAffectedCount(12000);
        cyclone.setInjuredCount(150);
        cyclone.setCreatedAt(LocalDateTime.now());

        // Flood (Uttarakhand)
        Alert flood = new Alert();
        flood.setType(AlertType.FLOOD);
        flood.setColor(AlertColor.RED);
        flood.setLocation("Chamoli, Uttarakhand");
        flood.setLatitude(30.4159);
        flood.setLongitude(79.3370);
        flood.setMagnitude("Critical Level");
        flood.setImpact("Glacial Lake Outburst");
        flood.setDetails("River Alaknanda overflowing.");
        flood.setTime("10 mins ago");
        flood.setMissionStatus("OPEN");
        flood.setTrustScore(95);
        flood.setReporterLevel("GROUND_SENSOR");
        flood.setSourceType("IOT-GRID");
        flood.setAffectedCount(4000);
        flood.setInjuredCount(20);
        flood.setCreatedAt(LocalDateTime.now());

        // Earthquake (Gujarat)
        Alert quake = new Alert();
        quake.setType(AlertType.EARTHQUAKE);
        quake.setColor(AlertColor.ORANGE);
        quake.setLocation("Bhuj, Gujarat");
        quake.setLatitude(23.2420);
        quake.setLongitude(69.6669);
        quake.setMagnitude("5.2 Richter");
        quake.setImpact("Minor Structural Damage");
        quake.setDetails("Aftershock detected.");
        flood.setTime("1 hour ago");
        quake.setMissionStatus("OPEN");
        quake.setTrustScore(85);
        quake.setReporterLevel("SATELLITE");
        quake.setSourceType("SAT-SEISMIC");
        quake.setAffectedCount(500);
        quake.setInjuredCount(5);
        quake.setCreatedAt(LocalDateTime.now());

        // Fire (Himachal)
        Alert fire = new Alert();
        fire.setType(AlertType.FIRE);
        fire.setColor(AlertColor.RED);
        fire.setLocation("Kasol, Himachal Pradesh");
        fire.setLatitude(32.0098);
        fire.setLongitude(77.3146);
        fire.setMagnitude("High Spread");
        fire.setImpact("Forest Cover Burning");
        fire.setDetails("Thermal anomaly detected.");
        fire.setTime("20 mins ago");
        fire.setMissionStatus("OPEN");
        fire.setTrustScore(90);
        fire.setReporterLevel("SATELLITE");
        fire.setSourceType("NASA-FIRMS");
        fire.setAffectedCount(200);
        fire.setInjuredCount(0);
        fire.setCreatedAt(LocalDateTime.now());

        alertRepository.saveAll(Arrays.asList(cyclone, flood, quake, fire));
        System.out.println("✅ 4 Real-World Alerts Created Successfully!");
    }
}