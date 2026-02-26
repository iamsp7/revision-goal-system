package com.ai.revisiongoal.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ai.revisiongoal.entity.Subject;
import com.ai.revisiongoal.service.SubjectService;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping
    public Subject createSubject(
            @RequestBody Subject subject,
            Authentication authentication
    ) {
        subject.setCreatedBy(authentication.getName());
        return subjectService.createSubject(subject);
    }

    @GetMapping
    public List<Subject> getMySubjects(Authentication authentication) {
        return subjectService.getUserSubjects(authentication.getName());
    }
}