package com.ai.revisiongoal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ai.revisiongoal.entity.QuizSession;

import java.util.List;

public interface QuizSessionRepository extends JpaRepository<QuizSession, Long> {
    List<QuizSession> findByUserId(Long userId);
}