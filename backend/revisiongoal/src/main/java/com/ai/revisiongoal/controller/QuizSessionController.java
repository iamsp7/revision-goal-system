package com.ai.revisiongoal.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import com.ai.revisiongoal.entity.QuizSession;
import com.ai.revisiongoal.entity.User;
import com.ai.revisiongoal.service.QuizSessionService;
import com.ai.revisiongoal.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin
public class QuizSessionController {

    private final QuizSessionService service;
    private final UserRepository userRepository;

    public QuizSessionController(QuizSessionService service,
                                 UserRepository userRepository) {
        this.service = service;
        this.userRepository = userRepository;
    }

    @PostMapping("/start")
    public QuizSession startSession(Authentication authentication,
                                    @RequestBody QuizSession session) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        session.setUserId(user.getId());
        session.setStartedAt(LocalDateTime.now());

        return service.startSession(session);
    }

    @PostMapping("/finish/{sessionId}")
    public QuizSession finishSession(
            @PathVariable Long sessionId,
            @RequestParam int totalQuestions,
            @RequestParam int correctAnswers,
            @RequestParam double totalScore
    ) {
        return service.finishSession(sessionId, totalQuestions, correctAnswers, totalScore);
    }

    @GetMapping("/me")
    public List<QuizSession> getMySessions(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return service.getSessionsByUser(user.getId());
    }
}