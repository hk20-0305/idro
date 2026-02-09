package com.india.idro.service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.india.idro.model.NGO;
import com.india.idro.model.ResourceItem;
import com.india.idro.model.enums.AvailabilityStatus;
import com.india.idro.model.enums.CoverageRadius;
import com.india.idro.model.enums.ResponseTime;
import com.india.idro.repository.NGORepository;

import jakarta.annotation.PostConstruct;

@Service
public class NGOService {

    @Autowired
    private NGORepository ngoRepository;

    @PostConstruct
    public void initializeDemoAccounts() {
        // Check if demo accounts already exist
        if (ngoRepository.count() > 0) {
            System.out.println("✅ NGO demo accounts already initialized");
            return;
        }

        System.out.println("🔧 Initializing 5 NGO demo accounts...");

        // Create 5 pre-defined NGO accounts
        List<NGO> demoNGOs = Arrays.asList(
                createDemoNGO(
                        "NGO001",
                        "123",
                        "Red Cross India",
                        "Mumbai",
                        "Maharashtra",
                        "+91-22-2307-7000",
                        "REG-RC-2001",
                        "Western India",
                        Arrays.asList("Flood", "Earthquake", "Cyclone", "Medical Emergency")),
                createDemoNGO(
                        "NGO002",
                        "123",
                        "Care India",
                        "Delhi",
                        "NCR",
                        "+91-11-4737-4500",
                        "REG-CI-2003",
                        "Northern India",
                        Arrays.asList("Drought", "Flood", "Health Crisis", "Food Security")),
                createDemoNGO(
                        "NGO003",
                        "123",
                        "Oxfam India",
                        "Bangalore",
                        "Karnataka",
                        "+91-80-4090-9200",
                        "REG-OI-2008",
                        "Southern India",
                        Arrays.asList("Flood", "Drought", "Cyclone", "Livelihood Support")),
                createDemoNGO(
                        "NGO004",
                        "123",
                        "Save the Children",
                        "Chennai",
                        "Tamil Nadu",
                        "+91-44-4213-0500",
                        "REG-SC-2005",
                        "Southern India",
                        Arrays.asList("Cyclone", "Flood", "Child Protection", "Education")),
                createDemoNGO(
                        "NGO005",
                        "123",
                        "Goonj",
                        "Kolkata",
                        "West Bengal",
                        "+91-33-2357-8900",
                        "REG-GJ-2004",
                        "Eastern India",
                        Arrays.asList("Flood", "Cyclone", "Material Relief", "Clothing Distribution")));

        ngoRepository.saveAll(demoNGOs);
        System.out.println("✅ Successfully initialized 5 NGO demo accounts");
    }

    private NGO createDemoNGO(String ngoId, String password, String ngoName,
            String city, String state, String contactNumber,
            String registrationId, String operatingRegion,
            List<String> supportedDisasterTypes) {
        NGO ngo = new NGO();
        ngo.setNgoId(ngoId);
        ngo.setPassword(password);
        ngo.setNgoName(ngoName);
        ngo.setCity(city);
        ngo.setState(state);
        ngo.setContactNumber(contactNumber);
        ngo.setRegistrationId(registrationId);
        ngo.setOperatingRegion(operatingRegion);
        ngo.setSupportedDisasterTypes(supportedDisasterTypes);

        // Initialize default resources
        Map<String, ResourceItem> reliefSupplies = new HashMap<>();
        reliefSupplies.put("foodPackets", new ResourceItem(false, 0));
        reliefSupplies.put("drinkingWater", new ResourceItem(false, 0));
        reliefSupplies.put("sanitaryKits", new ResourceItem(false, 0));
        ngo.setReliefSupplies(reliefSupplies);

        Map<String, ResourceItem> medicalSupport = new HashMap<>();
        medicalSupport.put("firstAidKits", new ResourceItem(false, 0));
        medicalSupport.put("doctors", new ResourceItem(false, 0));
        medicalSupport.put("nurses", new ResourceItem(false, 0));
        medicalSupport.put("ambulances", new ResourceItem(false, 0));
        ngo.setMedicalSupport(medicalSupport);

        Map<String, ResourceItem> shelterEssentials = new HashMap<>();
        shelterEssentials.put("tents", new ResourceItem(false, 0));
        shelterEssentials.put("blankets", new ResourceItem(false, 0));
        shelterEssentials.put("clothes", new ResourceItem(false, 0));
        ngo.setShelterEssentials(shelterEssentials);

        Map<String, ResourceItem> humanResources = new HashMap<>();
        humanResources.put("volunteers", new ResourceItem(false, 0));
        humanResources.put("rescueWorkers", new ResourceItem(false, 0));
        ngo.setHumanResources(humanResources);

        // Set default availability
        ngo.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
        ngo.setResponseTime(ResponseTime.IMMEDIATE);
        ngo.setCoverageRadius(CoverageRadius.DISTRICT_WIDE);

        return ngo;
    }

    public NGO authenticateNGO(String ngoId, String password) {
        Optional<NGO> ngoOpt = ngoRepository.findByNgoId(ngoId);

        if (ngoOpt.isEmpty()) {
            return null; // NGO not found
        }

        NGO ngo = ngoOpt.get();

        // Check password
        if (!ngo.getPassword().equals(password)) {
            return null; // Wrong password
        }

        return ngo; // Success
    }

    public NGO getNGOProfile(String ngoId) {
        return ngoRepository.findByNgoId(ngoId).orElse(null);
    }

    public NGO updateResources(String ngoId, Map<String, ResourceItem> reliefSupplies,
            Map<String, ResourceItem> medicalSupport,
            Map<String, ResourceItem> shelterEssentials,
            Map<String, ResourceItem> humanResources,
            String additionalNotes) {
        Optional<NGO> ngoOpt = ngoRepository.findByNgoId(ngoId);

        if (ngoOpt.isEmpty()) {
            return null;
        }

        NGO ngo = ngoOpt.get();

        // Update resources
        if (reliefSupplies != null)
            ngo.setReliefSupplies(reliefSupplies);
        if (medicalSupport != null)
            ngo.setMedicalSupport(medicalSupport);
        if (shelterEssentials != null)
            ngo.setShelterEssentials(shelterEssentials);
        if (humanResources != null)
            ngo.setHumanResources(humanResources);
        if (additionalNotes != null)
            ngo.setAdditionalNotes(additionalNotes);

        ngo.setLastUpdated(LocalDateTime.now());

        return ngoRepository.save(ngo);
    }

    public NGO updateAvailability(String ngoId, AvailabilityStatus availabilityStatus,
            ResponseTime responseTime, CoverageRadius coverageRadius) {
        Optional<NGO> ngoOpt = ngoRepository.findByNgoId(ngoId);

        if (ngoOpt.isEmpty()) {
            return null;
        }

        NGO ngo = ngoOpt.get();

        // Update availability
        if (availabilityStatus != null)
            ngo.setAvailabilityStatus(availabilityStatus);
        if (responseTime != null)
            ngo.setResponseTime(responseTime);
        if (coverageRadius != null)
            ngo.setCoverageRadius(coverageRadius);

        ngo.setLastUpdated(LocalDateTime.now());

        return ngoRepository.save(ngo);
    }

    public List<NGO> getAllNGOs() {
        return ngoRepository.findAll();
    }
}
