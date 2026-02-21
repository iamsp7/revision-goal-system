package com.ai.revisiongoal.controller;




import org.springframework.web.bind.annotation.*;

import com.ai.revisiongoal.entity.QuizAttempt;
import com.ai.revisiongoal.service.QuizAttemptService;

import java.util.List;

@RestController
@RequestMapping("/api/attempts")
@CrossOrigin
public class QuizAttemptController {

    private final QuizAttemptService service;

    public QuizAttemptController(QuizAttemptService service) {
        this.service = service;
    }

    @PostMapping
    public QuizAttempt submitAttempt(@RequestBody QuizAttempt attempt) {
        return service.saveAttempt(attempt);
    }

    @GetMapping("/user/{userId}")
    public List<QuizAttempt> getUserAttempts(@PathVariable Long userId) {
        return service.getAttemptsByUser(userId);
    }
}
