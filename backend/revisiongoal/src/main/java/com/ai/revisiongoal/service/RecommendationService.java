package com.ai.revisiongoal.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class RecommendationService {

    private final RestTemplate restTemplate;

    public RecommendationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Object recommendTopic(String topic, String subject) {

        String url = "http://localhost:8000/api/recommend?topic=" 
                + topic + "&subject=" + (subject != null ? subject : "");

        return restTemplate.getForObject(url, Object.class);
    }
}