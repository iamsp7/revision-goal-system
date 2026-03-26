package com.ai.revisiongoal.service;

import com.ai.revisiongoal.entity.TopicRevisionState;
import com.ai.revisiongoal.entity.Subject;
import com.ai.revisiongoal.repository.TopicRevisionStateRepository;
import com.ai.revisiongoal.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RevisionService {

    private final TopicRevisionStateRepository repository;
    private final SubjectRepository subjectRepository;

    public RevisionService(
            TopicRevisionStateRepository repository,
            SubjectRepository subjectRepository
    ) {
        this.repository = repository;
        this.subjectRepository = subjectRepository;
    }

    // =========================
    // Get Topics Due Today
    // =========================
    public List<TopicRevisionState> getTodayRevisionTopics(Long userId) {

        return repository.findByUserIdAndNextReviewBeforeAndMasteredFalse(
                userId,
                LocalDateTime.now()
        );
    }

    // =========================
    // Update After Quiz
    // =========================
    
    public void updateAfterQuiz(Long userId, String topic, String subjectName, double accuracy) {
    	
    	if (topic == null || topic.trim().isEmpty()) {
    	    throw new RuntimeException("Topic cannot be null or empty");
    	}

    	TopicRevisionState state = repository
    	        .findByUserIdAndTopic(userId, topic)
    	        .orElseGet(() -> TopicRevisionState.builder()
    	                .userId(userId)
    	                .topic(topic.trim()) // ✅ SAFE
    	                .correctStreak(0)
    	                .repetitions(0)
    	                .intervalDays(1)
    	                .easeFactor(2.5)
    	                .mastered(false)
    	                .build()
    	        );

        // 🔥 FIX: Convert subject name → Subject entity
        Subject subject = subjectRepository.findByNameIgnoreCase(subjectName)
                .orElseThrow(() -> new RuntimeException("Subject not found: " + subjectName));

        state.setSubject(subject); // ✅ CORRECT

        state.setLastReview(LocalDateTime.now());
        state.setLastAccuracy(accuracy);

        // 🎯 PERFORMANCE LOGIC
        if (accuracy >= 70) {
            state.setCorrectStreak(state.getCorrectStreak() + 1);
        } else {
            state.setCorrectStreak(0);
            state.setMastered(false);
        }

        // ✅ MASTERY CHECK
        if (state.getCorrectStreak() >= 2) {
            state.setMastered(true);
        }

        // 🧠 SPACED REPETITION
        if (accuracy < 50) {
            state.setRepetitions(0);
            state.setIntervalDays(1);
        } else {
            state.setRepetitions(state.getRepetitions() + 1);

            if (state.getRepetitions() == 1) {
                state.setIntervalDays(1);
            } else if (state.getRepetitions() == 2) {
                state.setIntervalDays(3);
            } else {
                state.setIntervalDays(
                        (int) Math.round(state.getIntervalDays() * state.getEaseFactor())
                );
            }
        }

        // Update ease factor
        double newEF = state.getEaseFactor() +
                (0.1 - (5 - (accuracy / 20.0)) *
                        (0.08 + (5 - (accuracy / 20.0)) * 0.02));

        state.setEaseFactor(Math.max(1.3, newEF));

        // ⏳ Next review
        state.setNextReview(LocalDateTime.now().plusDays(state.getIntervalDays()));

        repository.save(state);
    }
}