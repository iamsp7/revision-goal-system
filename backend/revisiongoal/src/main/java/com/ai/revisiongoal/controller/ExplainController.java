package com.ai.revisiongoal.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/explain")
@CrossOrigin
public class ExplainController {

    private final RestTemplate restTemplate;

    public ExplainController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping
    public Object explain(@RequestBody Map<String, String> request) {

        String topic = request.get("topic");

        String url = "http://localhost:8000/api/explain";

        return restTemplate.postForObject(url, request, Object.class);
    }
}