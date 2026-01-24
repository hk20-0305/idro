package com.india.idro.model;

import com.india.idro.model.enums.CampStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "camps")
public class Camp {

    @Id
    private String id;

    private String alertId;
    private String location;


    public String getAlertId() { return alertId; }
public void setAlertId(String alertId) { this.alertId = alertId; }



    private String name;              // e.g., "Kerala Relief Hub A"
    private CampStatus status;        // CRITICAL, STABLE, MODERATE
    private Integer urgencyScore;     // 0-100
    private Integer population;       // Number of people in camp
    private Stock stock;              // Embedded document (food, water, medicine)
    private String incomingAid;       // e.g., "Seva Foundation > Food Kits (ETA: 2h)"
    private String image;             // Image URL (optional)

    // Location coordinates
    private Double latitude;
    private Double longitude;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}