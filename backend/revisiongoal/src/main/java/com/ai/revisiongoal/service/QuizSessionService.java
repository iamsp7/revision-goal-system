package com.ai.revisiongoal.service;

import org.springframework.stereotype.Service;

import com.ai.revisiongoal.entity.QuizSession;
import com.ai.revisiongoal.repository.QuizSessionRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuizSessionService {

    private final QuizSessionRepository repository;

    public QuizSessionService(QuizSessionRepository repository) {
        this.repository = repository;
    }

    public QuizSession startSession(QuizSession session) {
        session.setStartedAt(LocalDateTime.now());
        return repository.save(session);
    }

    public QuizSession finishSession(Long sessionId, int totalQuestions, int correctAnswers, double totalScore) {

        QuizSession session = repository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setFinishedAt(LocalDateTime.now());
        session.setTotalQuestions(totalQuestions);
        session.setCorrectAnswers(correctAnswers);
        session.setTotalScore(totalScore);

        return repository.save(session);
    }

    public List<QuizSession> getSessionsByUser(Long userId) {
        return repository.findByUserId(userId);
    }
}