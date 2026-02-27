package com.ai.revisiongoal.service;

import org.springframework.stereotype.Service;
import com.ai.revisiongoal.entity.Subject;
import com.ai.revisiongoal.repository.SubjectRepository;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public Subject createSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    public List<Subject> getUserSubjects(String email) {
        return subjectRepository.findByCreatedBy(email);
    }
    public void deleteSubject(Long id) {
        subjectRepository.deleteById(id);
    }
}