package com.ai.revisiongoal.repository;

import com.ai.revisiongoal.entity.TopicRevisionState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TopicRevisionStateRepository
        extends JpaRepository<TopicRevisionState, Long> {

    Optional<TopicRevisionState> findByUserIdAndTopic(Long userId, String topic);

    List<TopicRevisionState> findByUserIdAndNextReviewLessThanEqual(
            Long userId,
            LocalDateTime date
    );
}