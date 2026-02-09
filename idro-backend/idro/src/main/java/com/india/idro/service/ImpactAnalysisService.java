package com.india.idro.service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.india.idro.dto.AiPredictionRequestDTO;
import com.india.idro.dto.AiPredictionResponseDTO;
import com.india.idro.dto.ImpactAnalysisResponseDTO;
import com.india.idro.model.Alert;
import com.india.idro.model.Camp;
import com.india.idro.model.CampAiAnalysis;
import com.india.idro.model.CampAiPrediction;
import com.india.idro.repository.AlertRepository;
import com.india.idro.repository.CampAiPredictionRepository;
import com.india.idro.repository.CampRepository;

/**
 * Service to orchestrate AI-driven impact analysis.
 * 
 * Flow:
 * 1. Fetch Mission (Alert)
 * 2. Fetch Camps
 * 3. Call ML Server for each Camp
 * 4. Persist Predictions
 * 5. Aggregate Results
 */
@Service
public class ImpactAnalysisService {

    private static final Logger logger = LoggerFactory.getLogger(ImpactAnalysisService.class);

    @Autowired
    private MlPredictionService mlPredictionService;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private CampRepository campRepository;

    @Autowired
    private CampAiPredictionRepository predictionRepository;

    /**
     * Orchestrates the AI analysis for all camps under a mission.
     * Returns a structured response with mission stats and camp breakdown.
     * 
     * @param missionId The ID of the mission (Alert) to analyze
     * @return Impact analysis response with camp-wise predictions
     * @throws RuntimeException if mission not found
     */
    public ImpactAnalysisResponseDTO analyzeMissionImpact(String missionId) {
        logger.info("Starting impact analysis for mission ID: {}", missionId);

        ImpactAnalysisResponseDTO response = new ImpactAnalysisResponseDTO();
        List<CampAiAnalysis> campAnalyses = new ArrayList<>();

        try {
            // ============================================================
            // 1. Fetch Mission Context
            // ============================================================
            Alert mission = alertRepository.findById(missionId)
                    .orElseThrow(() -> new RuntimeException("Mission not found with ID: " + missionId));

            // Set Response Metadata from Mission
            response.setMissionId(mission.getId());
            response.setDisasterType(mission.getType() != null ? mission.getType().toString() : "Unknown");
            response.setSeverity(mission.getMagnitude() != null ? mission.getMagnitude() : "Unknown");

            logger.info("✅ Mission loaded: {} (Type: {}, Severity: {})",
                    mission.getId(), response.getDisasterType(), response.getSeverity());

            // ============================================================
            // 2. Fetch Camps
            // ============================================================
            List<Camp> camps = campRepository.findByAlertId(missionId);
            if (camps == null)
                camps = new ArrayList<>();

            logger.info("Analyzing {} camps for mission {}", camps.size(), missionId);

            // ============================================================
            // 3. Process Each Camp (Async)
            // ============================================================
            List<CompletableFuture<CampAiAnalysis>> futures = camps.stream()
                    .map(camp -> CompletableFuture.supplyAsync(() -> processCamp(camp, mission)))
                    .collect(Collectors.toList());

            // Wait for all to complete
            campAnalyses = futures.stream()
                    .map(CompletableFuture::join)
                    .filter(java.util.Objects::nonNull)
                    .collect(Collectors.toList());

            // ============================================================
            // 4. Aggregate & Populate Response
            // ============================================================
            response.setCampAnalysisList(campAnalyses);

            // Calculate Overall Risk Score
            double avgRisk = campAnalyses.stream()
                    .mapToDouble(CampAiAnalysis::getRiskScore)
                    .average()
                    .orElse(0.0);
            response.setOverallRiskScore(Math.round(avgRisk * 100.0) / 100.0);

            logger.info("✅ Analysis complete. Risk Score: {}", response.getOverallRiskScore());

        } catch (Exception e) {
            logger.error("Error during impact analysis: {}", e.getMessage(), e);
            // Ensure non-null listing on error
            if (response.getCampAnalysisList() == null) {
                response.setCampAnalysisList(new ArrayList<>());
            }
            // Rethrow if mission not found
            if (e instanceof RuntimeException && e.getMessage().contains("Mission not found")) {
                throw (RuntimeException) e;
            }
        }

        // Final safety check
        if (response.getCampAnalysisList() == null) {
            response.setCampAnalysisList(new ArrayList<>());
        }

        return response;
    }

    /**
     * Process a single camp: Predict -> Save -> Map
     */
    private CampAiAnalysis processCamp(Camp camp, Alert mission) {
        try {
            // Build Request DTO
            AiPredictionRequestDTO request = new AiPredictionRequestDTO();

            // Mission Context
            request.setDisasterType(mission.getType() != null ? mission.getType().toString() : "Unknown");
            request.setSeverity(mission.getMagnitude() != null ? mission.getMagnitude() : "Moderate");
            request.setUrgency(mission.getUrgency() != null ? mission.getUrgency() : "Medium");

            // Camp Context
            request.setAffectedCount(camp.getPopulation() != null ? camp.getPopulation() : 0);
            request.setInjuredCount(0); // Camps focus on displaced
            request.setMissingCount(0);
            request.setLatitude(camp.getLatitude() != null ? camp.getLatitude() : 0.0);
            request.setLongitude(camp.getLongitude() != null ? camp.getLongitude() : 0.0);

            // Call ML Service
            AiPredictionResponseDTO mlResponse = mlPredictionService.predict(request);

            if (mlResponse != null) {
                // Save to DB
                savePrediction(mission.getId(), camp.getId(), mlResponse);

                // Map to Analysis Model
                return mapToAnalysis(camp, mlResponse);
            }

        } catch (Exception e) {
            logger.error("Failed to process camp {}: {}", camp.getId(), e.getMessage());
        }
        return null;
    }

    /**
     * Persist prediction to database
     */
    private void savePrediction(String missionId, String campId, AiPredictionResponseDTO mlResponse) {
        try {
            CampAiPrediction entity = new CampAiPrediction();
            entity.setMissionId(missionId);
            entity.setCampId(campId);

            if (mlResponse.getRequirements() != null) {
                var req = mlResponse.getRequirements();
                entity.setFoodPerDay(req.getFoodPacketsPerDay());
                entity.setWaterPerDay(req.getWaterLitersPerDay());
                entity.setMedicalKits(req.getMedicalKitsRequired());
                entity.setBeds(req.getBedsRequired());
                entity.setBlankets(req.getBlanketsRequired());
                entity.setToilets(req.getToiletsRequired());
                entity.setPowerUnits(req.getPowerUnitsRequired());
                entity.setAmbulances(req.getAmbulancesRequired());
                entity.setVolunteers(req.getVolunteersRequired());
            }

            entity.setRiskScore(mlResponse.getRiskScore());
            entity.setPredictionSource(mlResponse.getPredictionSource());
            entity.setExplanations(mlResponse.getExplanations());

            predictionRepository.save(entity);

        } catch (Exception e) {
            logger.error("Error saving prediction: {}", e.getMessage());
        }
    }

    /**
     * Map ML response to CampAiAnalysis model
     */
    private CampAiAnalysis mapToAnalysis(Camp camp, AiPredictionResponseDTO mlResponse) {
        CampAiAnalysis analysis = new CampAiAnalysis();
        analysis.setCampId(camp.getId());
        analysis.setCampName(camp.getName());

        if (mlResponse.getRequirements() != null) {
            var req = mlResponse.getRequirements();
            analysis.setPredictedFood(req.getFoodPacketsPerDay());
            analysis.setPredictedWater(req.getWaterLitersPerDay());
            analysis.setPredictedBeds(req.getBedsRequired());
            analysis.setPredictedMedicalKits(req.getMedicalKitsRequired());
            analysis.setPredictedVolunteers(req.getVolunteersRequired());
            analysis.setPredictedAmbulances(req.getAmbulancesRequired());
        }

        analysis.setRiskScore(mlResponse.getRiskScore() != null ? mlResponse.getRiskScore() : 0.0);
        analysis.setPredictionSource(mlResponse.getPredictionSource());
        analysis.setExplanations(
                mlResponse.getExplanations() != null ? mlResponse.getExplanations() : new ArrayList<>());

        return analysis;
    }
}
