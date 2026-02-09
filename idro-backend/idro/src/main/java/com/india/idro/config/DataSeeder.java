package com.india.idro.config;

import java.time.LocalDateTime;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.india.idro.model.Alert;
import com.india.idro.model.User;
import com.india.idro.model.enums.AlertColor;
import com.india.idro.model.enums.AlertType;
import com.india.idro.model.enums.UserRole;
import com.india.idro.repository.AlertRepository;
import com.india.idro.repository.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.india.idro.repository.CampRepository campRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedAlerts();
        seedCamps();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            System.out.println("🌱 No users found. Creating default admin users...");

            User gov = new User("admin", "Government Admin", "admin@gov.in", "admin", UserRole.GOV);
            User ngo = new User("ngo", "Red Cross Logistics", "contact@ngo.org", "ngo", UserRole.NGO);
            User vol = new User("hero", "Rahul Volunteer", "hero@gmail.com", "hero", UserRole.VOLUNTEER);

            userRepository.saveAll(Arrays.asList(gov, ngo, vol));

            System.out.println("✅ Default Users Created in MongoDB!");
        } else {
            System.out.println("✅ Users already initialized");
        }
    }

    private void seedAlerts() {
        if (alertRepository.count() == 0) {
            System.out.println("🌱 No alerts found. Creating demo alerts...");

            Alert flood = new Alert();
            flood.setType(AlertType.FLOOD);
            flood.setLocation("Kaziranga, Assam");
            flood.setLatitude(26.5775);
            flood.setLongitude(93.1711);
            flood.setMagnitude("8.5");
            flood.setUrgency("HIGH");
            flood.setColor(AlertColor.RED);
            flood.setImpact("CRITICAL");
            flood.setDetails(
                    "Severe flooding reported affecting wildlife and local villages. Need immediate evacuation assistance.");
            flood.setTime("08:30 AM"); // Should ideally be a timestamp but model uses String
            flood.setMissionStatus("ACTIVE");
            flood.setTrustScore(95);
            flood.setReporterLevel("OFFICIAL");
            flood.setSourceType("SATELLITE");
            flood.setAffectedCount(1500);
            flood.setInjuredCount(45);
            flood.setMissing("12");
            flood.setCreatedAt(LocalDateTime.now());
            flood.setResponderName("NDRF Team A");

            Alert cyclone = new Alert();
            cyclone.setType(AlertType.CYCLONE);
            cyclone.setLocation("Puri, Odisha");
            cyclone.setLatitude(19.8135);
            cyclone.setLongitude(85.8312);
            cyclone.setUrgency("MEDIUM");
            cyclone.setColor(AlertColor.ORANGE);
            cyclone.setImpact("MODERATE");
            cyclone.setDetails("Cyclonic storm approaching coast. Fishermen advised not to venture into sea.");
            cyclone.setTime("10:15 AM");
            cyclone.setMissionStatus("PENDING");
            cyclone.setTrustScore(88);
            cyclone.setReporterLevel("NGO");
            cyclone.setSourceType("GROUND_REPORT");
            cyclone.setAffectedCount(5000);
            cyclone.setInjuredCount(0);
            cyclone.setMissing("0");
            cyclone.setCreatedAt(LocalDateTime.now().minusHours(2));
            cyclone.setResponderName("Pending Assignment");

            Alert landslide = new Alert();
            landslide.setType(AlertType.LANDSLIDE);
            landslide.setLocation("Wayanad, Kerala");
            landslide.setLatitude(11.6854);
            landslide.setLongitude(76.1320);
            landslide.setUrgency("HIGH");
            landslide.setColor(AlertColor.RED);
            landslide.setImpact("SEVERE");
            landslide.setDetails("Major landslide blocking NH766. Rescue operations underway.");
            landslide.setTime("06:45 AM");
            landslide.setMissionStatus("ACTIVE");
            landslide.setTrustScore(92);
            landslide.setReporterLevel("CITIZEN");
            landslide.setSourceType("APP_REPORT");
            landslide.setAffectedCount(200);
            landslide.setInjuredCount(15);
            landslide.setMissing("30");
            landslide.setCreatedAt(LocalDateTime.now().minusHours(5));
            landslide.setResponderName("Local Fire Dept");

            alertRepository.saveAll(Arrays.asList(flood, cyclone, landslide));

            System.out.println("✅ Default Alerts Created in MongoDB!");
        } else {
            System.out.println("✅ Alerts already initialized");
        }
    }

    private void seedCamps() {
        if (campRepository.count() == 0) {
            System.out.println("🌱 No camps found. Creating demo camps linked to alerts...");

            java.util.List<Alert> alerts = alertRepository.findAll();
            java.util.List<com.india.idro.model.Camp> camps = new java.util.ArrayList<>();

            for (Alert alert : alerts) {
                // Determine camp names based on location
                String baseName = alert.getLocation().split(",")[0];

                // Camp 1
                com.india.idro.model.Camp camp1 = new com.india.idro.model.Camp();
                camp1.setName(baseName + " Relief Camp A");
                camp1.setLocation(alert.getLocation());
                camp1.setLatitude(alert.getLatitude() + 0.01); // Slightly offset
                camp1.setLongitude(alert.getLongitude() + 0.01);
                camp1.setCapacity(1000);
                camp1.setPopulation(500);
                camp1.setAlertId(alert.getId());
                camps.add(camp1);

                // Camp 2 (only for high magnitude or random)
                if (alert.getAffectedCount() > 1000) {
                    com.india.idro.model.Camp camp2 = new com.india.idro.model.Camp();
                    camp2.setName(baseName + " Shelter B");
                    camp2.setLocation(alert.getLocation());
                    camp2.setLatitude(alert.getLatitude() - 0.01);
                    camp2.setLongitude(alert.getLongitude() - 0.01);
                    camp2.setCapacity(800);
                    camp2.setPopulation(350);
                    camp2.setAlertId(alert.getId());
                    camps.add(camp2);
                }
            }

            campRepository.saveAll(camps);
            System.out.println("✅ Helper Camps Created: " + camps.size());
        } else {
            System.out.println("✅ Camps already initialized");
        }
    }
}