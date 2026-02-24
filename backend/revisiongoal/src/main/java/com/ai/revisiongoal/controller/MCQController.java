package com.ai.revisiongoal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ai.revisiongoal.entity.MCQQuestion;
import com.ai.revisiongoal.service.MCQService;
import com.ai.revisiongoal.service.McqGenerationService;

import java.util.List;

@RestController
@RequestMapping("/api/mcq")
@CrossOrigin
public class MCQController {

    private final MCQService mcqService;
    private final McqGenerationService mcqGenerationService;

    public MCQController(MCQService mcqService,
                         McqGenerationService mcqGenerationService) {
        this.mcqService = mcqService;
        this.mcqGenerationService = mcqGenerationService;
    }

    @PostMapping("/generate-from-pdf")
    public ResponseEntity<?> generateFromPdf(
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        String result = mcqGenerationService.generateFromPdf(file);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public MCQQuestion addMCQ(@RequestBody MCQQuestion mcq) {
        return mcqService.addMCQ(mcq);
    }

    @GetMapping
    public List<MCQQuestion> getAllMCQs() {
        return mcqService.getAllMCQs();
    }
}