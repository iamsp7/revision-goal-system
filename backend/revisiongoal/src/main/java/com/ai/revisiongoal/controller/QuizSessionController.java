package com.ai.revisiongoal.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import com.ai.revisiongoal.entity.QuizSession;
import com.ai.revisiongoal.entity.User;
import com.ai.revisiongoal.service.QuizSessionService;
import com.ai.revisiongoal.service.RevisionService;
import com.ai.revisiongoal.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin
public class QuizSessionController {

    private final QuizSessionService service;
    private final UserRepository userRepository;
    private final RevisionService revisionService;

    public QuizSessionController(
            QuizSessionService service,
            UserRepository userRepository,
            RevisionService revisionService
    ) {
        this.service = service;
        this.userRepository = userRepository;
        this.revisionService = revisionService;
    }

    @PostMapping("/start")
    public QuizSession startSession(Authentication authentication,
                                    @RequestBody QuizSession session) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        session.setUserId(user.getId());
        session.setStartedAt(LocalDateTime.now());

        if (session.getTopic() == null || session.getTopic().trim().isEmpty()) {
            throw new RuntimeException("Topic must be provided when starting quiz");
        }
        System.out.println("🔥 START SESSION TOPIC: " + session.getTopic());
        return service.startSession(session);
    }

    @PostMapping("/finish/{sessionId}")
    public QuizSession finishSession(
            @PathVariable Long sessionId,
            @RequestParam int totalQuestions,
            @RequestParam int correctAnswers,
            @RequestParam double totalScore
    ) {

        QuizSession session = service.finishSession(
                sessionId,
                totalQuestions,
                correctAnswers,
                totalScore
        );

        // 🔥 CALCULATE ACCURACY
        double accuracy = totalQuestions > 0
                ? (correctAnswers * 100.0) / totalQuestions
                : 0;

        // 🔥 GET DATA
        String topic = session.getTopic();
        String subjectName = session.getSubject().getName();

        // 🔥 MAIN FIX (THIS WAS MISSING)
        revisionService.updateAfterQuiz(
                session.getUserId(),
                topic,
                subjectName,
                accuracy
        );

        return session;
    }

    @GetMapping("/me")
    public List<QuizSession> getMySessions(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return service.getSessionsByUser(user.getId());
    }
}