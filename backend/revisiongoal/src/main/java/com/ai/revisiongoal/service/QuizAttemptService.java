package com.ai.revisiongoal.service;

import org.springframework.stereotype.Service;
import com.ai.revisiongoal.entity.QuizAttempt;
import com.ai.revisiongoal.repository.QuizAttemptRepository;

import java.util.List;

@Service
public class QuizAttemptService {

    private final QuizAttemptRepository repository;

    public QuizAttemptService(QuizAttemptRepository repository) {
        this.repository = repository;
    }

    public QuizAttempt saveAttempt(QuizAttempt attempt) {
        return repository.save(attempt);
    }

    public List<QuizAttempt> getAttemptsBySession(Long sessionId) {
        return repository.findByQuizSessionId(sessionId);
    }
}