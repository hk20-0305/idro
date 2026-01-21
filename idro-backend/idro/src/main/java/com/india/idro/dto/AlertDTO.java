package com.india.idro.dto;

import lombok.Data;

@Data
public class AlertDTO {
    private String id;
    private AlertType type;      // Uses the Enum we just created
    private String location;
    private String magnitude;
    private String impact;
    private AlertColor color;    // Uses the Enum we just created
    private String time;
    
    // ✅ This fixes the "setDescription undefined" error
    private String description;  
    
    private double latitude;
    private double longitude;
    
    // Trust Score fields (Optional but good to have in DTO)
    private int trustScore;
    private String reporterLevel;
}