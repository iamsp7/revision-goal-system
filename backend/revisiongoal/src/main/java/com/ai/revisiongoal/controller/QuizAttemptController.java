package com.ai.revisiongoal.controller;

import org.springframework.web.bind.annotation.*;
import com.ai.revisiongoal.entity.QuizAttempt;
import com.ai.revisiongoal.service.QuizAttemptService;

import java.util.List;

@RestController
@RequestMapping("/api/attempts")
@CrossOrigin
public class QuizAttemptController {

    private final QuizAttemptService service;

    public QuizAttemptController(QuizAttemptService service) {
        this.service = service;
    }

    // Save single question attempt (used internally during quiz submit)
    @PostMapping
    public QuizAttempt saveAttempt(@RequestBody QuizAttempt attempt) {
        return service.saveAttempt(attempt);
    }

    // Get attempts by quiz session
    @GetMapping("/session/{sessionId}")
    public List<QuizAttempt> getAttemptsBySession(@PathVariable Long sessionId) {
        return service.getAttemptsBySession(sessionId);
    }
}