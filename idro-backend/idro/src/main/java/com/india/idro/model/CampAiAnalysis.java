package com.india.idro.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampAiAnalysis {

    private String campId;
    private String campName;

    // Resource Predictions
    private int predictedFood;
    private int predictedWater;
    private int predictedBeds;
    private int predictedMedicalKits;
    private int predictedVolunteers;
    private int predictedAmbulances;

    // Metadata
    private String predictionSource; // "ML" or "Fallback"
    private double riskScore;
    private List<String> explanations;
}
