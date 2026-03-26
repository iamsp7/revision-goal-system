package com.ai.revisiongoal.controller;

import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ai.revisiongoal.service.RecommendationService;

@RestController
@RequestMapping("/api/recommend")
public class RecommendationController {

    private final RecommendationService service;

    public RecommendationController(RecommendationService service) {
        this.service = service;
    }

    @GetMapping
    public Object recommend(
            @RequestParam String topic,
            @RequestParam(required = false) String subject
    ) {
        return service.recommendTopic(topic, subject);
    }
}