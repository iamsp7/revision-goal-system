package com.ai.revisiongoal.controller;

import com.ai.revisiongoal.entity.TopicRevisionState;
import com.ai.revisiongoal.entity.User;
import com.ai.revisiongoal.repository.TopicRevisionStateRepository;
import com.ai.revisiongoal.repository.UserRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/revision")
@CrossOrigin
public class DailyRevisionController {

    private final TopicRevisionStateRepository revisionRepository;
    private final UserRepository userRepository;

    public DailyRevisionController(
            TopicRevisionStateRepository revisionRepository,
            UserRepository userRepository
    ) {
        this.revisionRepository = revisionRepository;
        this.userRepository = userRepository;
    }

    public record RevisionDTO(String topic, String subject) {}
    @DeleteMapping("/delete")
    public String deleteTopic(
            @RequestParam String topic,
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TopicRevisionState state = revisionRepository
                .findByUserIdAndTopic(user.getId(), topic)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        revisionRepository.delete(state);

        return "Deleted successfully";
    }

    @GetMapping("/daily")
    public List<RevisionDTO> getDailyRevision(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<TopicRevisionState> dueTopics =
                revisionRepository.findByUserIdAndMasteredFalse(
                        user.getId()
                );

        return dueTopics.stream()
                .map(t -> new RevisionDTO(
                        t.getTopic(),
                        t.getSubject() != null ? t.getSubject().getName() : "General"
                ))
                .toList();
    }
}