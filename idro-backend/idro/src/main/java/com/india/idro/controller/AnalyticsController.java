package com.india.idro.controller;

import com.india.idro.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping
    public Map<String, Object> getAnalytics() {
        // ✅ FIXED: Calling the correct method name 'getDashboardStats'
        return analyticsService.getDashboardStats();
    }
    
    @GetMapping("/prediction")
    public String getPrediction() {
        return analyticsService.predictNextThreat();
    }
}