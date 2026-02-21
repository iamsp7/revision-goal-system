package com.ai.revisiongoal.controller;




import org.springframework.beans.factory.annotation.Autowired;
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
    
    @Autowired
    private McqGenerationService mcqGenerationService;


    public MCQController(MCQService mcqService) {
        this.mcqService = mcqService;
    }
    @PostMapping("/generate-from-pdf")
    public ResponseEntity<?> generateFromPdf(@RequestParam("file") MultipartFile file) throws Exception {

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
