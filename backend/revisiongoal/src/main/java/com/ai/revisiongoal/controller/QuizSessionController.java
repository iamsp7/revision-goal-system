package com.ai.revisiongoal.controller;

import org.springframework.web.bind.annotation.*;
import com.ai.revisiongoal.entity.QuizSession;
import com.ai.revisiongoal.service.QuizSessionService;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin
public class QuizSessionController {

    private final QuizSessionService service;

    public QuizSessionController(QuizSessionService service) {
        this.service = service;
    }

    // Start quiz
    @PostMapping("/start")
    public QuizSession startSession(@RequestBody QuizSession session) {
        return service.startSession(session);
    }

    // Finish quiz
    @PostMapping("/finish/{sessionId}")
    public QuizSession finishSession(
            @PathVariable Long sessionId,
            @RequestParam int totalQuestions,
            @RequestParam int correctAnswers,
            @RequestParam double totalScore
    ) {
        return service.finishSession(sessionId, totalQuestions, correctAnswers, totalScore);
    }

    // Get all sessions of a user
    @GetMapping("/user/{userId}")
    public List<QuizSession> getUserSessions(@PathVariable Long userId) {
        return service.getSessionsByUser(userId);
    }
}