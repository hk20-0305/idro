package com.india.idro.model;

import com.india.idro.model.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "actions")
public class Action {

    @Id
    private String id;

    private UserRole role;           // GOV, NGO, VOLUNTEER
    private String targetZone;       // e.g., "Himachal Pradesh (Earthquake Zone)"
    private String resourceType;     // e.g., "NDRF Rescue Team", "Food & Water"
    private String quantity;         // e.g., "500 units", "Describe damage..."
    private Boolean priority;        // High priority flag
    private String userId;           // Reference to user who created action (optional for now)

    @CreatedDate
    private LocalDateTime timestamp;
}