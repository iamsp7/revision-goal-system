package com.ai.revisiongoal.controller;



import org.springframework.web.bind.annotation.*;

import com.ai.revisiongoal.entity.CodingQuestion;
import com.ai.revisiongoal.service.CodingQuestionService;

import java.util.List;

@RestController
@RequestMapping("/api/coding")
@CrossOrigin
public class CodingQuestionController {

    private final CodingQuestionService service;

    public CodingQuestionController(CodingQuestionService service) {
        this.service = service;
    }

    @PostMapping
    public CodingQuestion add(@RequestBody CodingQuestion question) {
        return service.addQuestion(question);
    }

    @GetMapping
    public List<CodingQuestion> getAll() {
        return service.getAllQuestions();
    }
}
