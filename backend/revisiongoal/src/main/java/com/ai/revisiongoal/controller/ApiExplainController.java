package com.ai.revisiongoal.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/explain")
@CrossOrigin
public class ApiExplainController {

    private final RestTemplate restTemplate;

    public ApiExplainController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping
    public Object getArticle(
            @RequestParam String topic,
            @RequestParam(required = false) String subject
    ) {

        // ✅ Encode URL properly
        String encodedTopic = URLEncoder.encode(topic, StandardCharsets.UTF_8);
        String encodedSubject = subject != null
                ? URLEncoder.encode(subject, StandardCharsets.UTF_8)
                : "";

        String url = "http://localhost:8000/api/explain?topic="
                + encodedTopic + "&subject=" + encodedSubject;

        return restTemplate.getForObject(url, Object.class);
    }
}