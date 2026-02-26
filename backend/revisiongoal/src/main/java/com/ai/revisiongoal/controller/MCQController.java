package com.ai.revisiongoal.controller;

import com.ai.revisiongoal.entity.MCQQuestion;
import com.ai.revisiongoal.entity.Subject;
import com.ai.revisiongoal.repository.SubjectRepository;
import com.ai.revisiongoal.service.MCQService;
import com.ai.revisiongoal.service.McqGenerationService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/mcq")
@CrossOrigin
public class MCQController {

    private final MCQService mcqService;
    private final McqGenerationService mcqGenerationService;
    private final SubjectRepository subjectRepository;

    public MCQController(MCQService mcqService,
                         McqGenerationService mcqGenerationService,
                         SubjectRepository subjectRepository) {
        this.mcqService = mcqService;
        this.mcqGenerationService = mcqGenerationService;
        this.subjectRepository = subjectRepository;
    }

    // ================= GENERATE FROM PDF =================
    @PostMapping("/generate-from-pdf")
    public ResponseEntity<?> generateFromPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam Long subjectId
    ) throws Exception {

        String result = mcqGenerationService.generateFromPdf(file);
        return saveMcqsToDatabase(result, subjectId, "PDF Upload");
    }

    // ================= GENERATE FROM TOPIC =================
    @PostMapping("/generate-from-topic")
    public ResponseEntity<?> generateFromTopic(
            @RequestParam Long subjectId,
            @RequestParam String topic
    ) throws Exception {

        String result = mcqGenerationService.generateFromTopic(topic);
        return saveMcqsToDatabase(result, subjectId, topic);
    }

    // ================= GENERATE FROM LINK =================
    @PostMapping("/generate-from-link")
    public ResponseEntity<?> generateFromLink(
            @RequestParam Long subjectId,
            @RequestParam String link
    ) throws Exception {

        String result = mcqGenerationService.generateFromLink(link);
        return saveMcqsToDatabase(result, subjectId, "Website Content");
    }

    // ================= MANUAL ADD =================
    @PostMapping
    public MCQQuestion addMCQ(@RequestBody MCQQuestion mcq) {
        return mcqService.addMCQ(mcq);
    }

    // ================= GET ALL =================
    @GetMapping
    public List<MCQQuestion> getAllMCQs() {
        return mcqService.getAllMCQs();
    }

    // ================= COMMON SAVE METHOD =================
    private ResponseEntity<?> saveMcqsToDatabase(
            String result,
            Long subjectId,
            String topic
    ) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(result);

        JsonNode mcqArray = root.get("mcqs");

        if (mcqArray == null || !mcqArray.isArray()) {
            return ResponseEntity.badRequest().body("Invalid MCQ format received");
        }

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        List<MCQQuestion> savedMcqs = new ArrayList<>();

        for (JsonNode node : mcqArray) {

            List<String> options = new ArrayList<>();
            node.get("options").forEach(opt -> options.add(opt.asText()));

            MCQQuestion mcq = MCQQuestion.builder()
                    .question(node.get("question").asText())
                    .options(options)
                    .answer(node.get("answer").asText())
                    .subject(subject)
                    .topic(topic)   // 🔥 THIS FIXES YOUR NULL TOPIC
                    .build();

            savedMcqs.add(mcqService.addMCQ(mcq));
        }

        return ResponseEntity.ok(savedMcqs);
    }
}