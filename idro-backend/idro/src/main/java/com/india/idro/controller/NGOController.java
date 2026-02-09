package com.india.idro.controller;

import com.india.idro.dto.AvailabilityUpdateRequest;
import com.india.idro.dto.NGOLoginRequest;
import com.india.idro.dto.NGOLoginResponse;
import com.india.idro.dto.ResourceUpdateRequest;
import com.india.idro.model.NGO;
import com.india.idro.service.NGOService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ngo")
@CrossOrigin(origins = "*")
public class NGOController {

    @Autowired
    private NGOService ngoService;

    @PostMapping("/login")
    public ResponseEntity<NGOLoginResponse> login(@RequestBody NGOLoginRequest request) {
        System.out.println("🔐 NGO Login Attempt: " + request.getNgoId());

        NGO ngo = ngoService.authenticateNGO(request.getNgoId(), request.getPassword());

        if (ngo != null) {
            // Remove password from response for security
            ngo.setPassword(null);
            
            NGOLoginResponse response = new NGOLoginResponse(
                true,
                "Login successful",
                ngo
            );
            return ResponseEntity.ok(response);
        } else {
            NGOLoginResponse response = new NGOLoginResponse(
                false,
                "Invalid NGO ID or Password",
                null
            );
            return ResponseEntity.status(401).body(response);
        }
    }

    @GetMapping("/profile/{ngoId}")
    public ResponseEntity<?> getProfile(@PathVariable String ngoId) {
        NGO ngo = ngoService.getNGOProfile(ngoId);

        if (ngo != null) {
            // Remove password from response
            ngo.setPassword(null);
            return ResponseEntity.ok(ngo);
        } else {
            return ResponseEntity.status(404).body("NGO not found");
        }
    }

    @PutMapping("/resources")
    public ResponseEntity<?> updateResources(@RequestBody ResourceUpdateRequest request) {
        System.out.println("📦 Updating resources for NGO: " + request.getNgoId());

        NGO updatedNGO = ngoService.updateResources(
            request.getNgoId(),
            request.getReliefSupplies(),
            request.getMedicalSupport(),
            request.getShelterEssentials(),
            request.getHumanResources(),
            request.getAdditionalNotes()
        );

        if (updatedNGO != null) {
            updatedNGO.setPassword(null);
            return ResponseEntity.ok(updatedNGO);
        } else {
            return ResponseEntity.status(404).body("NGO not found");
        }
    }

    @PutMapping("/availability")
    public ResponseEntity<?> updateAvailability(@RequestBody AvailabilityUpdateRequest request) {
        System.out.println("🟢 Updating availability for NGO: " + request.getNgoId());

        NGO updatedNGO = ngoService.updateAvailability(
            request.getNgoId(),
            request.getAvailabilityStatus(),
            request.getResponseTime(),
            request.getCoverageRadius()
        );

        if (updatedNGO != null) {
            updatedNGO.setPassword(null);
            return ResponseEntity.ok(updatedNGO);
        } else {
            return ResponseEntity.status(404).body("NGO not found");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<NGO>> getAllNGOs() {
        System.out.println("📋 Fetching all NGOs for government visibility");
        
        List<NGO> ngos = ngoService.getAllNGOs();
        
        // Remove passwords from all NGOs
        ngos.forEach(ngo -> ngo.setPassword(null));
        
        return ResponseEntity.ok(ngos);
    }
}
