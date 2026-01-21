package com.india.idro.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "alerts")
public class Alert {
    @Id
    private String id;
    private String type;           // Fire, Flood, etc.
    private String location;
    private String details;
    private String color;          // RED, ORANGE, GREEN
    
    // ✅ MISSING FIELDS ADDED HERE
    private String magnitude;      // e.g. "7.2"
    private String impact;         // e.g. "Critical"
    private String time;           // e.g. "10:30 AM"

    private double latitude;
    private double longitude;
    
    private String missionStatus;   // OPEN, ASSIGNED
    private String responderName;   // Who accepted it
    private String createdAt;

    // TRUST SYSTEM FIELDS
    private int trustScore;         
    private String reporterLevel;   
    private String sourceType;      
}