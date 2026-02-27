package com.ai.revisiongoal.service;

import com.ai.revisiongoal.entity.QuizSession;
import com.ai.revisiongoal.entity.TopicRevisionState;
import com.ai.revisiongoal.repository.QuizSessionRepository;
import com.ai.revisiongoal.repository.TopicRevisionStateRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class QuizSessionService {

    private final QuizSessionRepository repository;
    private final TopicRevisionStateRepository revisionRepository;
    private final RestTemplate restTemplate;

    private final String FASTAPI_URL = "http://localhost:8000/update-spaced-repetition";

    public QuizSessionService(
            QuizSessionRepository repository,
            TopicRevisionStateRepository revisionRepository,
            RestTemplate restTemplate
    ) {
        this.repository = repository;
        this.revisionRepository = revisionRepository;
        this.restTemplate = restTemplate;
    }

    // =========================
    // Start Session
    // =========================
    public QuizSession startSession(QuizSession session) {
        session.setStartedAt(LocalDateTime.now());
        return repository.save(session);
    }

    // =========================
    // Finish Session + Spaced Repetition
    // =========================
    public QuizSession finishSession(Long sessionId,
            int totalQuestions,
            int correctAnswers,
            double totalScore) {

QuizSession session = repository.findById(sessionId)
.orElseThrow(() -> new RuntimeException("Session not found"));

session.setFinishedAt(LocalDateTime.now());
session.setTotalQuestions(totalQuestions);
session.setCorrectAnswers(correctAnswers);
session.setTotalScore(totalScore);

repository.save(session);

double accuracy = totalQuestions == 0
? 0
: ((double) correctAnswers / totalQuestions) * 100;

// 🔥 SAFE SUBJECT FETCH
Long subjectId = session.getSubject().getId();

String topic = repository.findById(sessionId)
.map(s -> s.getSubject().getName())
.orElse("Unknown");

updateSpacedRepetition(session.getUserId(), topic, accuracy);

return session;
}
    // =========================
    // Update Spaced Repetition
    // =========================
    private void updateSpacedRepetition(Long userId, String topic, double accuracy) {

        TopicRevisionState state = revisionRepository
                .findByUserIdAndTopic(userId, topic)
                .orElse(
                        TopicRevisionState.builder()
                                .userId(userId)
                                .topic(topic)
                                .repetitions(0)
                                .easeFactor(2.5)
                                .intervalDays(1)
                                .build()
                );

        // Prepare request body for FastAPI
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("accuracy", accuracy);
        requestBody.put("repetitions", state.getRepetitions());
        requestBody.put("easeFactor", state.getEaseFactor());
        requestBody.put("intervalDays", state.getIntervalDays());

        try {
            ResponseEntity<Map> response =
                    restTemplate.postForEntity(
                            FASTAPI_URL,
                            requestBody,
                            Map.class
                    );

            Map result = response.getBody();

            if (result != null) {
                state.setRepetitions((Integer) result.get("repetitions"));
                state.setEaseFactor(Double.parseDouble(result.get("easeFactor").toString()));
                state.setIntervalDays((Integer) result.get("intervalDays"));
                state.setNextReview(LocalDateTime.parse(result.get("nextReview").toString()));
                state.setLastReview(LocalDateTime.now());
                state.setLastAccuracy(accuracy);

                revisionRepository.save(state);
            }

        } catch (Exception e) {
            System.out.println("FastAPI spaced repetition error: " + e.getMessage());
        }
    }

    // =========================
    // Get Sessions By User
    // =========================
    public List<QuizSession> getSessionsByUser(Long userId) {
        return repository.findByUserId(userId);
    }
}