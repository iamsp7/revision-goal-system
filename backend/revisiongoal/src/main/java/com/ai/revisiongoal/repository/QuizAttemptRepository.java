package com.ai.revisiongoal.repository;




import org.springframework.data.jpa.repository.JpaRepository;

import com.ai.revisiongoal.entity.QuizAttempt;

import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserId(Long userId);
}
