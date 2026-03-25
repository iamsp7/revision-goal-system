package com.ai.revisiongoal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.ai.revisiongoal.entity.QuizAttempt;

import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    // Get all attempts inside a session
    List<QuizAttempt> findByQuizSessionId(Long sessionId);

    // Get attempts by user (through session relation)
    List<QuizAttempt> findByQuizSessionUserId(Long userId);

    // Get attempts by subject
    List<QuizAttempt> findByQuizSessionSubjectId(Long subjectId);
    
    @Modifying
    @Query("DELETE FROM QuizAttempt qa WHERE qa.mcqQuestion.subject.id = :subjectId")
    void deleteBySubjectId(Long subjectId);
}