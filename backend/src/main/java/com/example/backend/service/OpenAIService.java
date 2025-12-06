package com.example.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

@Service
public class OpenAIService {
    private static final Logger log = LoggerFactory.getLogger(OpenAIService.class);

    @Value("${openai.api.key:}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
    private final ObjectMapper mapper = new ObjectMapper();

    @PostConstruct
    public void init() {
        if (!isConfigured()) {
            log.warn("OpenAI API key is not configured. /api/chat will not work until OPENAI_API_KEY is set.");
        } else {
            log.info("OpenAI API key configured (value hidden). Ready to call OpenAI.");
        }
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    public boolean checkModeration(String input) throws IOException, InterruptedException {
        if (input == null) return false;
        if (!isConfigured()) return false;

        Map<String, Object> payload = Map.of("input", input);
        String body = mapper.writeValueAsString(payload);

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/moderations"))
                .timeout(Duration.ofSeconds(10))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() >= 400) return false;

        JsonNode node = mapper.readTree(resp.body());
        JsonNode results = node.path("results");
        if (results.isArray() && results.size() > 0) {
            return results.get(0).path("flagged").asBoolean(false);
        }
        return false;
    }

    public String chatReply(List<Map<String, String>> messages, String systemPrompt) throws IOException, InterruptedException {
        if (!isConfigured()) throw new IllegalStateException("OPENAI_API_KEY not set");

        // Build messages: prepend system prompt
        List<Map<String, String>> payloadMessages = new ArrayList<>();
        if (systemPrompt != null && !systemPrompt.isBlank()) {
            payloadMessages.add(Map.of("role", "system", "content", systemPrompt));
        }
        if (messages != null) payloadMessages.addAll(messages);

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "gpt-4o-mini");
        payload.put("messages", payloadMessages);

        String body = mapper.writeValueAsString(payload);

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .timeout(Duration.ofSeconds(20))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() >= 400) {
            throw new IOException("OpenAI error: " + resp.body());
        }

        JsonNode root = mapper.readTree(resp.body());
        JsonNode choices = root.path("choices");
        if (choices.isArray() && choices.size() > 0) {
            JsonNode message = choices.get(0).path("message");
            String content = message.path("content").asText(null);
            if (content == null || content.isEmpty()) {
                // fallback for different shapes
                return choices.get(0).path("text").asText("");
            }
            return content;
        }
        return "";
    }
}
