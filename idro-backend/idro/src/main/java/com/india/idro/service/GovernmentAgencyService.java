package com.india.idro.service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.india.idro.model.GovernmentAgency;
import com.india.idro.model.ResourceItem;
import com.india.idro.model.enums.AgencyType;
import com.india.idro.model.enums.AvailabilityStatus;
import com.india.idro.model.enums.CoverageRadius;
import com.india.idro.model.enums.ResponseTime;
import com.india.idro.repository.GovernmentAgencyRepository;

import jakarta.annotation.PostConstruct;

@Service
public class GovernmentAgencyService {

    @Autowired
    private GovernmentAgencyRepository agencyRepository;

    @PostConstruct
    public void initializeDemoAgencies() {
        // Check if demo agencies already exist
        if (agencyRepository.count() > 0) {
            System.out.println("✅ Government Agency demo accounts already initialized");
            return;
        }

        System.out.println("🔧 Initializing 4 Government Agency demo accounts...");

        // Create 4 pre-defined government agency accounts
        List<GovernmentAgency> demoAgencies = Arrays.asList(
                createDemoAgency(
                        "NDRF001",
                        "NDRF Delhi",
                        AgencyType.NDRF,
                        "New Delhi",
                        "+91-11-2671-9391",
                        "Northern India",
                        Arrays.asList("Flood", "Earthquake", "Building Collapse", "Landslide")),
                createDemoAgency(
                        "MED001",
                        "Emergency Medical Team Mumbai",
                        AgencyType.MEDICAL_TEAM,
                        "Mumbai",
                        "+91-22-2307-7000",
                        "Western India",
                        Arrays.asList("Medical Emergency", "Epidemic", "Mass Casualty", "Health Crisis")),
                createDemoAgency(
                        "FIRE001",
                        "Fire & Rescue Services Bangalore",
                        AgencyType.FIRE_TEAM,
                        "Bangalore",
                        "+91-80-2222-2222",
                        "Southern India",
                        Arrays.asList("Fire", "Building Collapse", "Chemical Hazard", "Rescue Operations")),
                createDemoAgency(
                        "OTHER001",
                        "Police Disaster Management Chennai",
                        AgencyType.OTHER,
                        "Chennai",
                        "+91-44-2345-0000",
                        "Southern India",
                        Arrays.asList("Cyclone", "Flood", "Crowd Management", "Law & Order")));

        agencyRepository.saveAll(demoAgencies);
        System.out.println("✅ Successfully initialized " + demoAgencies.size() + " government agency demo accounts");
    }

    private GovernmentAgency createDemoAgency(String agencyId, String agencyName, AgencyType agencyType,
            String location, String contactNumber, String operatingRegion, List<String> supportedDisasterTypes) {
        GovernmentAgency agency = new GovernmentAgency();
        agency.setAgencyId(agencyId);
        agency.setAgencyName(agencyName);
        agency.setAgencyType(agencyType);
        agency.setLocation(location);
        agency.setContactNumber(contactNumber);
        agency.setPassword("123"); // Demo password
        agency.setOperatingRegion(operatingRegion);
        agency.setSupportedDisasterTypes(supportedDisasterTypes);
        agency.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
        agency.setResponseTime(ResponseTime.IMMEDIATE);
        agency.setCoverageRadius(CoverageRadius.DISTRICT_WIDE);
        agency.setLastUpdated(LocalDateTime.now());

        // Initialize resources based on agency type
        Map<String, List<ResourceItem>> resources = new HashMap<>();

        switch (agencyType) {
            case NDRF:
                resources.put("NDRF_RESOURCES", Arrays.asList(
                        new ResourceItem("Rescue Personnel", true, 50),
                        new ResourceItem("Boats", true, 10),
                        new ResourceItem("Rescue Vehicles", true, 15),
                        new ResourceItem("Diving Teams", true, 5),
                        new ResourceItem("Heavy Equipment", true, 8)));
                break;
            case MEDICAL_TEAM:
                resources.put("MEDICAL_RESOURCES", Arrays.asList(
                        new ResourceItem("Doctors", true, 20),
                        new ResourceItem("Nurses", true, 40),
                        new ResourceItem("Ambulances", true, 12),
                        new ResourceItem("First Aid Kits", true, 100),
                        new ResourceItem("Mobile Medical Units", true, 5)));
                break;
            case FIRE_TEAM:
                resources.put("FIRE_RESOURCES", Arrays.asList(
                        new ResourceItem("Fire Engines", true, 10),
                        new ResourceItem("Firefighters", true, 60),
                        new ResourceItem("Hydraulic Cutters", true, 8),
                        new ResourceItem("Ladders", true, 15),
                        new ResourceItem("Foam Units", true, 6)));
                break;
            case OTHER:
                resources.put("OTHER_RESOURCES", Arrays.asList(
                        new ResourceItem("Police Personnel", true, 100),
                        new ResourceItem("Traffic Control Units", true, 10),
                        new ResourceItem("Crowd Management Teams", true, 8)));
                break;
        }

        agency.setResources(resources);
        return agency;
    }

    public GovernmentAgency getAgencyByAgencyId(String agencyId) {
        Optional<GovernmentAgency> agency = agencyRepository.findByAgencyId(agencyId);
        return agency.orElse(null);
    }

    public GovernmentAgency updateAvailability(String agencyId, AvailabilityStatus availabilityStatus,
            ResponseTime responseTime, CoverageRadius coverageRadius) {
        Optional<GovernmentAgency> agencyOpt = agencyRepository.findByAgencyId(agencyId);

        if (agencyOpt.isEmpty()) {
            return null;
        }

        GovernmentAgency agency = agencyOpt.get();

        if (availabilityStatus != null)
            agency.setAvailabilityStatus(availabilityStatus);
        if (responseTime != null)
            agency.setResponseTime(responseTime);
        if (coverageRadius != null)
            agency.setCoverageRadius(coverageRadius);

        agency.setLastUpdated(LocalDateTime.now());

        return agencyRepository.save(agency);
    }

    public GovernmentAgency updateResources(String agencyId, Map<String, List<ResourceItem>> resources) {
        Optional<GovernmentAgency> agencyOpt = agencyRepository.findByAgencyId(agencyId);

        if (agencyOpt.isEmpty()) {
            return null;
        }

        GovernmentAgency agency = agencyOpt.get();

        if (resources != null) {
            agency.setResources(resources);
        }

        agency.setLastUpdated(LocalDateTime.now());

        return agencyRepository.save(agency);
    }
}
