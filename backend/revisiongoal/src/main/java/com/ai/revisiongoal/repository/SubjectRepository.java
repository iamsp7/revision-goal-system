package com.ai.revisiongoal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ai.revisiongoal.entity.Subject;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    List<Subject> findByCreatedBy(String createdBy);

    // ✅ ADD THIS LINE
    Optional<Subject> findByNameIgnoreCase(String name);
}