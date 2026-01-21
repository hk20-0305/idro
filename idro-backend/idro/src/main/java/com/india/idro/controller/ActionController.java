package com.india.idro.controller;

import org.springframework.web.bind.annotation.*;

// ✅ REMOVED: unused import java.time.LocalDateTime

@RestController
@RequestMapping("/api/actions")
public class ActionController {

    // (Your existing Action logic goes here, or leave empty if not used yet)
    // This is just a placeholder to resolve the import warning.
    
    @GetMapping("/ping")
    public String healthCheck() {
        return "Action Controller is Active";
    }
}