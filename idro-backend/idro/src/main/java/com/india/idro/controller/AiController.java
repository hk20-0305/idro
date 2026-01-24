package com.india.idro.controller;

import com.india.idro.service.GeminiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin
public class AiController {

    private final GeminiService geminiService;

    public AiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    // Browser test endpoint
    @GetMapping("/test")
    public String test() {
        return geminiService.analyzeDisaster("""
        {
          "type": "Flood",
          "location": "Uttarakhand",
          "affected": 800,
          "severity": "High"
        }
        """);
    }

    // Used by frontend Mission Control
    @PostMapping("/analyze")
    public String analyze(@RequestBody String disasterJson) {
        return geminiService.analyzeDisaster(disasterJson);
    }
}
