package com.india.idro.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.india.idro.service.NasaFirmsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/nasa")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NasaController {

    private final NasaFirmsService nasaFirmsService;

    @GetMapping("/fires")
    public List<Map<String, Object>> getFires() {
        return nasaFirmsService.getGlobalFires();
    }
}
