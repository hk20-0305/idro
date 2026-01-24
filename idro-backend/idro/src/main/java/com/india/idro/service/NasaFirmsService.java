package com.india.idro.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class NasaFirmsService {

    private final WebClient webClient;

    private static final String BASE_URL = "https://firms.modaps.eosdis.nasa.gov/api";
    private static final String MAP_KEY = "6543ad950d161a57ae1917119ff453e1";

    public NasaFirmsService() {
        this.webClient = WebClient.builder()
                .baseUrl(BASE_URL)
                .codecs(c -> c.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                .build();
    }

 public List<Map<String, Object>> getGlobalFires() {

    String csv = webClient.get()
.uri("/area/csv/" + MAP_KEY + "/VIIRS_SNPP_NRT/68,8,90,37/1")
            .retrieve()
            .bodyToMono(String.class)
            .block();

    if (csv == null || csv.isBlank()) {
        System.out.println("NASA CSV is empty");
        return List.of();
    }

    // Debug: print first 500 chars
    System.out.println("NASA RAW CSV:\n" + csv.substring(0, Math.min(500, csv.length())));

    String[] lines = csv.split("\\r?\\n");
    List<Map<String, Object>> alerts = new ArrayList<>();

    for (String line : lines) {

        // Skip headers and comments
        if (line.startsWith("#") || line.startsWith("latitude") || line.trim().isEmpty()) {
            continue;
        }

        String[] cols = line.split(",");

        // Ensure minimum columns exist
        if (cols.length < 9) continue;

        try {
            double lat = Double.parseDouble(cols[0].trim());
            double lon = Double.parseDouble(cols[1].trim());

            // FIRMS confidence is often text: low, nominal, high
            String confidenceRaw = cols[8].trim().toLowerCase();
            int trustScore = switch (confidenceRaw) {
                case "low" -> 40;
                case "nominal" -> 65;
                case "high" -> 90;
                default -> 50;
            };

            Map<String, Object> alert = new HashMap<>();
            alert.put("id", UUID.randomUUID().toString());
            alert.put("latitude", lat);
            alert.put("longitude", lon);
            alert.put("location", "India (NASA Satellite)");
            alert.put("type", "FIRE");
            alert.put("details", "Thermal anomaly detected by NASA FIRMS");
            alert.put("trustScore", trustScore);

            alerts.add(alert);

            if (alerts.size() >= 30) break;

        } catch (Exception e) {
            // Skip bad rows safely
        }
    }

    System.out.println("Parsed NASA alerts: " + alerts.size());
    return alerts;
}

private String getLocationName(double lat, double lon) {
    try {
        WebClient geoClient = WebClient.create("https://nominatim.openstreetmap.org");

        String response = geoClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/reverse")
                        .queryParam("format", "json")
                        .queryParam("lat", lat)
                        .queryParam("lon", lon)
                        .build())
                .header("User-Agent", "IDRO/1.0") // important: Nominatim requires this
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if (response == null) return "Unknown location";

        if (response.contains("\"display_name\"")) {
            int start = response.indexOf("\"display_name\":\"") + 16;
            int end = response.indexOf("\"", start);
            return response.substring(start, end);
        }

    } catch (Exception e) {
        // ignore safely
    }

    return "Remote Area (Satellite)";
}

}