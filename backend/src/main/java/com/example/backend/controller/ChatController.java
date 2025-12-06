package com.example.backend.controller;

import com.example.backend.dto.chat.ChatRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.service.OpenAIService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatController {
    private final OpenAIService openAIService;

    @Value("${openai.system.prompt:}")
    private String configuredSystemPrompt;

    public ChatController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, String>>> chat(@RequestBody ChatRequest req) {
        ApiResponse<Map<String, String>> res = new ApiResponse<>();
        try {
            if (!openAIService.isConfigured()) {
                res.setCode(4001);
                res.setMessage("OpenAI API key is not configured on server");
                return ResponseEntity.badRequest().body(res);
            }

            String userInput = req.getMessage();
            if (userInput == null) userInput = "";

            // Moderation check
            boolean flagged = openAIService.checkModeration(userInput);
            if (flagged) {
                res.setCode(4002);
                res.setMessage("Content violates moderation policy");
                res.setResult(Map.of("reply", "Xin lỗi, nội dung của bạn không thể được xử lý."));
                return ResponseEntity.ok(res);
            }

            // Build messages: convert history (if provided) to list of role/content
            List<Map<String, String>> messages = new ArrayList<>();
            if (req.getHistory() != null) messages.addAll(req.getHistory());
            // append user
            messages.add(Map.of("role", "user", "content", userInput));

                // Use configured system prompt if provided; otherwise fallback to a safe default
                String systemPrompt = (configuredSystemPrompt != null && !configuredSystemPrompt.isBlank())
                    ? configuredSystemPrompt
                    : "Bạn là trợ lý sức khỏe thân thiện. Cung cấp thông tin sức khỏe chung, không thay thế chẩn đoán y tế. Luôn khuyến nghị người dùng tư vấn bác sĩ khi cần. Nếu người dùng mô tả tình huống khẩn cấp, hướng dẫn họ liên hệ dịch vụ cấp cứu.";

                String reply = openAIService.chatReply(messages, systemPrompt);

            res.setResult(Map.of("reply", reply));
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.setCode(5000);
            res.setMessage("Server error: " + e.getMessage());
            res.setResult(Map.of("reply", "Có lỗi khi xử lý yêu cầu."));
            return ResponseEntity.status(500).body(res);
        }
    }
}
