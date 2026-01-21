package com.india.idro.dto;

import com.india.idro.model.Alert;
import org.springframework.stereotype.Component;

@Component
public class DTOMapper {

    // Convert Entity (DB) -> DTO (Frontend)
    public AlertDTO toDTO(Alert alert) {
        AlertDTO dto = new AlertDTO();
        dto.setId(alert.getId());
        
        // ✅ Fix: Convert String to Enum safely
        try {
            dto.setType(AlertType.valueOf(alert.getType()));
        } catch (Exception e) {
            dto.setType(AlertType.OTHER); // Fallback if type doesn't match
        }

        dto.setLocation(alert.getLocation());
        
        // ✅ Fix: Handle potential nulls for magnitude/impact
        dto.setMagnitude(alert.getMagnitude() != null ? alert.getMagnitude() : "N/A");
        dto.setImpact(alert.getImpact() != null ? alert.getImpact() : "Unknown");
        dto.setTime(alert.getTime() != null ? alert.getTime() : alert.getCreatedAt());

        dto.setDescription(alert.getDetails());

        // ✅ Fix: Convert String to Enum safely
        try {
            dto.setColor(AlertColor.valueOf(alert.getColor()));
        } catch (Exception e) {
            dto.setColor(AlertColor.RED); // Default
        }
        
        dto.setLatitude(alert.getLatitude());
        dto.setLongitude(alert.getLongitude());
        
        return dto;
    }

    // Convert DTO (Frontend) -> Entity (DB)
    public Alert toEntity(AlertDTO dto) {
        Alert alert = new Alert();
        alert.setId(dto.getId());
        
        // ✅ Fix: Convert Enum to String (.name())
        if (dto.getType() != null) {
            alert.setType(dto.getType().name());
        }

        alert.setLocation(dto.getLocation());
        alert.setMagnitude(dto.getMagnitude());
        alert.setImpact(dto.getImpact());
        
        // ✅ Fix: Convert Enum to String
        if (dto.getColor() != null) {
            alert.setColor(dto.getColor().name());
        } else {
            alert.setColor("RED");
        }

        alert.setTime(dto.getTime());
        alert.setDetails(dto.getDescription());
        alert.setLatitude(dto.getLatitude());
        alert.setLongitude(dto.getLongitude());
        
        return alert;
    }
}