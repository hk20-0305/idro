package com.india.idro.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final Client client;

    public GeminiService(@Value("${gemini.api.key}") String apiKey) {
        this.client = Client.builder()
                .apiKey(apiKey)
                .build();
    }

    // This is the ONLY method AiController should call
    public String analyzeDisaster(String disasterJson) {

        String prompt = """
You are an expert disaster response AI.

Based on this disaster data:
%s

Return ONLY valid JSON in this exact format:

{
  "needs": [
    "Medical teams: 4",
    "Food kits: 1200",
    "Boats: 6"
  ],
  "allocation": [
    "NGO A → 500 food kits → Zone 1",
    "Govt Hospital → 2 ambulances → Zone 1",
    "Rescue Team B → 1 unit → Zone 2"
  ],
  "execution": [
    "3 teams dispatched",
    "2 pending confirmations",
    "1 delayed due to access issues"
  ]
}

IMPORTANT:
- Do NOT add explanation text
- Do NOT use ```json
- Output must be pure JSON only
""".formatted(disasterJson);

        try {
            GenerateContentResponse response =
                    client.models.generateContent(
                            "models/gemini-2.5-flash",
                            prompt,
                            null
                    );

            return response.text();

        } catch (Exception e) {
            e.printStackTrace();
            return "{ \"error\": \"Gemini failed: " + e.getMessage() + "\" }";
        }
    }
}
