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

    @GetMapping("/daily")
    public List<String> getDailyRevision(Authentication authentication) {

        // 🔥 authentication.getName() is EMAIL
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<TopicRevisionState> dueTopics =
                revisionRepository.findByUserIdAndNextReviewLessThanEqual(
                        user.getId(),
                        LocalDateTime.now()
                );

        return dueTopics.stream()
                .map(TopicRevisionState::getTopic)
                .toList();
    }
}