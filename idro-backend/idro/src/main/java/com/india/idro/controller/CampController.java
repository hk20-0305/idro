package com.india.idro.controller;

import com.india.idro.model.Camp;
import com.india.idro.model.Stock;
import com.india.idro.model.enums.CampStatus;
import com.india.idro.service.CampService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/camps")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CampController {

    private final CampService campService;

    // GET /api/camps - Get all camps
    @GetMapping
    public ResponseEntity<List<Camp>> getAllCamps() {
        List<Camp> camps = campService.getAllCamps();
        return ResponseEntity.ok(camps);
    }

    // GET /api/camps/{id} - Get camp by ID
    @GetMapping("/{id}")
    public ResponseEntity<Camp> getCampById(@PathVariable String id) {
        return campService.getCampById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/camps/status/{status} - Get camps by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Camp>> getCampsByStatus(@PathVariable CampStatus status) {
        List<Camp> camps = campService.getCampsByStatus(status);
        return ResponseEntity.ok(camps);
    }

    // GET /api/camps/critical - Get critical camps (urgency >= 80)
    @GetMapping("/critical")
    public ResponseEntity<List<Camp>> getCriticalCamps() {
        List<Camp> camps = campService.getCriticalCamps();
        return ResponseEntity.ok(camps);
    }

    // GET /api/camps/search?keyword=kerala - Search camps by name
    @GetMapping("/search")
    public ResponseEntity<List<Camp>> searchCamps(@RequestParam String keyword) {
        List<Camp> camps = campService.searchCampsByName(keyword);
        return ResponseEntity.ok(camps);
    }

    // GET /api/camps/urgency/{threshold} - Get camps by urgency threshold
    @GetMapping("/urgency/{threshold}")
    public ResponseEntity<List<Camp>> getCampsByUrgency(@PathVariable Integer threshold) {
        List<Camp> camps = campService.getCampsByUrgencyThreshold(threshold);
        return ResponseEntity.ok(camps);
    }

    // POST /api/camps - Create new camp
    @PostMapping
    public ResponseEntity<Camp> createCamp(@RequestBody Camp camp) {
        Camp createdCamp = campService.createCamp(camp);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCamp);
    }

    // PUT /api/camps/{id} - Update camp
    @PutMapping("/{id}")
    public ResponseEntity<Camp> updateCamp(
            @PathVariable String id,
            @RequestBody Camp camp) {
        try {
            Camp updatedCamp = campService.updateCamp(id, camp);
            return ResponseEntity.ok(updatedCamp);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PATCH /api/camps/{id}/status - Update camp status only
    @PatchMapping("/{id}/status")
    public ResponseEntity<Camp> updateCampStatus(
            @PathVariable String id,
            @RequestBody CampStatus status) {
        try {
            Camp updatedCamp = campService.updateCampStatus(id, status);
            return ResponseEntity.ok(updatedCamp);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PATCH /api/camps/{id}/stock - Update camp stock
    @PatchMapping("/{id}/stock")
    public ResponseEntity<Camp> updateCampStock(
            @PathVariable String id,
            @RequestBody Stock stock) {
        try {
            Camp updatedCamp = campService.updateCampStock(id, stock);
            return ResponseEntity.ok(updatedCamp);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PATCH /api/camps/{id}/population - Update camp population
    @PatchMapping("/{id}/population")
    public ResponseEntity<Camp> updateCampPopulation(
            @PathVariable String id,
            @RequestBody Integer population) {
        try {
            Camp updatedCamp = campService.updateCampPopulation(id, population);
            return ResponseEntity.ok(updatedCamp);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/camps/{id} - Delete camp
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCamp(@PathVariable String id) {
        campService.deleteCamp(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/camps/count - Get total camp count
    @GetMapping("/count")
    public ResponseEntity<Long> getCampCount() {
        long count = campService.getCampCount();
        return ResponseEntity.ok(count);
    }

    // GET /api/camps/count/critical - Get critical camp count
    @GetMapping("/count/critical")
    public ResponseEntity<Long> getCriticalCampCount() {
        long count = campService.getCriticalCampCount();
        return ResponseEntity.ok(count);
    }
}