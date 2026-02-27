//package com.ai.revisiongoal.service;
//
//
//
//import org.springframework.stereotype.Service;
//
//import com.ai.revisiongoal.entity.MCQQuestion;
//import com.ai.revisiongoal.repository.MCQQuestionRepository;
//
//import java.util.List;
//
//@Service
//public class MCQService {
//
//    private final MCQQuestionRepository mcqRepository;
//
//    public MCQService(MCQQuestionRepository mcqRepository) {
//        this.mcqRepository = mcqRepository;
//    }
//
//    public MCQQuestion addMCQ(MCQQuestion mcq) {
//        // business logic goes here
//        return mcqRepository.save(mcq);
//    }
//
//    public List<MCQQuestion> getAllMCQs() {
//        return mcqRepository.findAll();
//    }
//}
package com.ai.revisiongoal.service;

import org.springframework.stereotype.Service;
import com.ai.revisiongoal.entity.MCQQuestion;
import com.ai.revisiongoal.repository.MCQQuestionRepository;

import java.util.List;

@Service
public class MCQService {

    private final MCQQuestionRepository mcqRepository;

    public MCQService(MCQQuestionRepository mcqRepository) {
        this.mcqRepository = mcqRepository;
    }

    // Add MCQ
    public MCQQuestion addMCQ(MCQQuestion mcq) {
        return mcqRepository.save(mcq);
    }

    // Get all MCQs
    public List<MCQQuestion> getAllMCQs() {
        return mcqRepository.findAll();
    }

    // Get MCQs by subject
    public List<MCQQuestion> getMcqsBySubject(Long subjectId) {
        return mcqRepository.findBySubjectId(subjectId);
    }

    // Delete single MCQ
    public void deleteMcq(Long id) {
        mcqRepository.deleteById(id);
    }

    // Delete all MCQs of a subject
    public void deleteBySubject(Long subjectId) {
        mcqRepository.deleteBySubjectId(subjectId);
    }
}
