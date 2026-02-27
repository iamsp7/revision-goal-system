package com.ai.revisiongoal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ai.revisiongoal.entity.MCQQuestion;

import java.util.List;

public interface MCQQuestionRepository extends JpaRepository<MCQQuestion, Long> {

    // Get MCQs by subject
    List<MCQQuestion> findBySubjectId(Long subjectId);

    // Delete all MCQs of a subject
    void deleteBySubjectId(Long subjectId);
}