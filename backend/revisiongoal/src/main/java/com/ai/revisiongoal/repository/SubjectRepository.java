package com.ai.revisiongoal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ai.revisiongoal.entity.Subject;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    List<Subject> findByCreatedBy(String createdBy);
}